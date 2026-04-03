import { getCurrentUser } from "@/app/lib/auth"
import { Role } from "@/app/types/types";
import { redirect } from "next/navigation";


const DashboardLayout = async () => {

    const user = await getCurrentUser();

    if (!user) {
        redirect('/login')
    }

    switch (user.role) {
        case Role.ADMIN:
            redirect("/dashboard/admin");
        case Role.MANAGER:
            redirect("/dashboard/manager");
        case Role.USER:
            redirect("/dashboard/user");
        default:
            redirect("dashboard/user");
    }
};

export default DashboardLayout;