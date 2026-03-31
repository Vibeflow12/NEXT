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
        const user = await getCurrentUser();

        if (!user || !checkUserPermission(user, Role.ADMIN)) {
            return NextResponse.json({
                error: "you are not authorized to assign team"
            }, { status: 401 }
            );
        }

        const { teamId } = await req.json()

        if (teamId) {
            const team = await prisma.team.findUnique({
                where: { id: teamId },
            });

            if (!team) {
                return NextResponse.json(
                    {
                        error: "team not found"
                    }, { status: 404 }
                );
            }
        }

        //update user team assigement
        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: {
                teamId: teamId
            },
            include: {
                team: true
            },
        })

        return NextResponse.json({
            user: updateUser,
            message: teamId ? "user assigned from team successfully" : "user removed from team successfully"
        });

    } catch (error) {
        console.error("Team assigment error:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({
                error: " user not found"
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