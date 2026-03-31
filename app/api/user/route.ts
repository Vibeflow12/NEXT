import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "You are not authorized to access user info" },
                { status: 401 }
            );
        }

        const searchParams = req.nextUrl.searchParams;
        const teamId = searchParams.get("teamId");
        const roleParam = searchParams.get("role");

        const where: Prisma.UserWhereInput = {};

        // 🔒 Role-based filtering
        if (user.role === Role.ADMIN) {
            // Admin: no restrictions
        } else if (user.role === Role.MANAGER) {
            where.OR = [
                { teamId: user.teamId },
                { role: Role.USER } // cross-team users only
            ];
        } else {
            where.teamId = user.teamId;
            where.role = { not: Role.ADMIN };
        }

        // ⚙️ Additional filters (safe parsing)
        if (teamId) {
            where.teamId = teamId;
        }

        if (roleParam && Object.values(Role).includes(roleParam as Role)) {
            where.role = roleParam as Role;
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ users });

    } catch (error) {
        console.error("Get users error:", error);

        return NextResponse.json(
            { error: "Internal server error, something went wrong" },
            { status: 500 }
        );
    }
}