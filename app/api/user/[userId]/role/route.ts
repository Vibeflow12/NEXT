import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await context.params;
        const currentUser = await getCurrentUser();

        if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
            return NextResponse.json({
                error: "you are not authorized to assign team"
            }, { status: 401 }
            );
        }

        //prevent user user from changing there own role 
        if (userId === currentUser.id) {
            return NextResponse.json({
                error: "you cannot change your own role"
            }, { status: 401 }
            );

        }
        const { role } = await req.json()

        //validate role


        const validateRoles = [Role.USER, Role.MANAGER]



        if (!validateRoles.includes(role)) {
            return NextResponse.json(
                {
                    error: "Invalid role or you cannot have more than one admin role user"
                }, { status: 404 }
            );
        }


        //update user role assigement
        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: {
                role,
            },
            include: {
                team: true
            },
        })

        return NextResponse.json({
            user: updateUser,
            message: `user role update to ${role}  successfully`
        });

    } catch (error) {
        console.error("Role assigment error:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({
                error: "user not found"
            }, { status: 404 }
            )
        }
        return NextResponse.json({
            error: "internal servver error,something went wrong"
        },
            {
                status: 500
            }
        );
    }

}