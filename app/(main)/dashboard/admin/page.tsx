import { checkUserPermission, getCurrentUser } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types/types";
import { redirect } from "next/navigation";
import AdminDashboard from "@/app/components/dashboard/AdminDashboard";
import { transformUsers, transformTeams } from "@/app/lib/util";

const AdminPage = async () => {
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user, Role.ADMIN)) {
        redirect("/unauthorized")
    };

    const [prismaUsers, prismaTeams] = await Promise.all([
        prisma.user.findMany({
            include: {
                team: true,
            },
            orderBy: { createdAt: "desc" }
        }),
        prisma.team.findMany({
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        email: true,
                    }
                }
            }
        })
    ])

    const users = transformUsers(prismaUsers);
    const teams = transformTeams(prismaTeams);
    return (
        <AdminDashboard users={users} teams={teams} currentUser={user} />
    )
};


export default AdminPage;