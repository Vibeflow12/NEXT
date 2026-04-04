"use client"

import { apiClient } from "@/app/lib/apiClient";
import { Team, User } from "@/app/types/types";
import { Role } from "@prisma/client";
import { useTransition } from "react";
import { useRouter } from "next/navigation"; // Better than window.reload

interface AdminDashboardProps {
    users: User[];
    teams: Team[];
    currentUser: User;
}

const AdminDashboard = ({ users, teams, currentUser }: AdminDashboardProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleTeamAssignment = async (userId: string, teamId: string | null) => {
        startTransition(async () => {
            try {
                await apiClient.assignUserToTeam(userId, teamId);
                router.refresh(); // Updates Server Component data without a full page reload
            } catch (e) {
                alert(e instanceof Error ? e.message : "Error updating team assignment");
            }
        });
    };

    const handleRoleAssignment = async (userId: string, newRole: Role) => {
        if (userId === currentUser.id) {
            alert("You cannot change your own role");
            return;
        }

        startTransition(async () => {
            try {
                await apiClient.updateUserRole(userId, newRole);
                router.refresh();
            } catch (e) {
                alert(e instanceof Error ? e.message : "Error updating role assignment");
            }
        });
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold mb-2 text-white">Admin Dashboard</h1>
                <p className="text-slate-300">User and team management</p>
            </header>

            <div className="grid md:grid-cols-1 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                        <h3 className="font-semibold text-white">Users ({users.length})</h3>
                        <p className="text-slate-400 text-sm">Manage roles and team assignments</p>
                    </div>

                    <div className="p-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 text-left">
                                    <th className="py-3 text-slate-300 font-medium">Name</th>
                                    <th className="py-3 text-slate-300 font-medium">Role</th>
                                    <th className="py-3 text-slate-300 font-medium">Team</th>
                                    <th className="py-3 text-slate-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {users.map((user) => (
                                    <tr key={user.id} className={isPending ? "opacity-50 transition-opacity" : ""}>
                                        <td className="py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-slate-200 font-medium">{user.name}</div>
                                                    <div className="text-slate-500 text-xs">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleAssignment(user.id, e.target.value as Role)}
                                                disabled={isPending || user.id === currentUser.id}
                                                className="bg-slate-900 text-slate-200 border border-slate-700 rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value={Role.USER}>User</option>
                                                <option value={Role.ADMIN}>Admin</option>
                                                <option value={Role.MANAGER}>Manager</option>
                                            </select>
                                        </td>
                                        <td className="py-4">
                                            <select
                                                value={user.teamId || ""}
                                                onChange={(e) => handleTeamAssignment(user.id, e.target.value || null)}
                                                disabled={isPending}
                                                className="bg-slate-900 text-slate-200 border border-slate-700 rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="">No Team</option>
                                                {teams.map((team) => (
                                                    <option key={team.id} value={team.id}>{team.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-4">
                                            {user.teamId && (
                                                <button
                                                    onClick={() => handleTeamAssignment(user.id, null)}
                                                    disabled={isPending}
                                                    className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50 transition-colors"
                                                >
                                                    Remove Team
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;