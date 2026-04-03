import { checkUserPermission, getCurrentUser } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types/types";
import { redirect } from "next/navigation";

const ManagerPage = async () => {
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user, Role.MANAGER)) {
        redirect("/unauthorized")
    };

    const prismaMyTeamMembers = user.teamId
        ?
        prisma.user.findMany({
            where: {
                teamId: user.teamId,
                role: { not: Role.ADMIN },
            },
            include: {
                team: true,
            }
        })
        : [];

    // fetch all team memebers cross-team view 
    const prismaAllTeamMembers = prisma.user.findMany({
        where: {
            role: { not: Role.ADMIN },
        },
        include: {
            team: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    description: true
                }
            },
            orderBy: {
                teamId: "desc"
            }
        }
    });

    return (
        <ManagerDashboard myTeamMembers={prismaMyTeamMembers} allTeamMembers={prismaAllTeamMembers} currentUser={user} />
    )
};


export default ManagerPage;