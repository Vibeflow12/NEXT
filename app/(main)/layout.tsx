import React from "react";
import Header from "@/app/components/layout/Header"
import { apiClient } from "../lib/apiClient";
import { Role } from "../types/types";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {

    const user = await apiClient.getCurrentUser();
    const mappedUser = user ? { ...user, role: user.role as Role, teamId: user.teamId || undefined } : null;
    return (
        <>
            <Header user={mappedUser} />
            <main className="container mx-auto px-4 py-8">{children}</main>
        </>
    )
}

export default MainLayout;