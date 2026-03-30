import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { generateToken, hashPssword } from "@/app/lib/auth"
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, teamCode } = await req.json()
        //validate req fields
        if (!name || !email || !password) {
            return NextResponse.json({
                error: "name,email and password are required or not valid"
            }
                , { status: 400 }
            )
        };
        //fined existing user
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
        }

        let teamId: string | undefined;
        if (teamCode) {
            const team = await prisma.team.findUnique({
                where: { code: teamCode },
            });

            if (!team) {
                return NextResponse.json(
                    {
                        error: "Please enter a valid team code"
                    }, { status: 400 }
                );
            }
            teamId = team.id;
        }

        const hashedPssword = await hashPssword(password);
        //first user become admin other be users  
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? Role.ADMIN : Role.USER;

        const createUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPssword,
                role,
                teamId,
            },
            include: {
                team: true
            },
        });
        //generate token
        const token = generateToken(createUser.id)

        const response = NextResponse.json({
            user: {
                id: createUser.id,
                email: createUser.email,
                name: createUser.name,
                role: createUser.role,
                teamId: createUser.teamId,
                team: createUser.team,
                token,
            }
        }, { status: 201 });

        //set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        })
        return response;
    } catch (error) {
        console.error("Registration failed", error)
        return NextResponse.json({
            error: "internal server error, something went wrong"
        }, { status: 500 })
    };
};