'use client'

import { createContext, useActionState, useContext, useEffect, useState } from "react";
import { AuthContexType, Role, User } from '@/app/types/types'
import { apiClient } from "../lib/apiClient";

import { useRouter } from "next/navigation";

interface LoginState {
    success?: boolean,
    user: User | null,
    error?: string
}


const AuthContext = createContext<AuthContexType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    const [loginState, loginAction, isLoginPending] = useActionState(
        async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            try {
                const data = await apiClient.login(email, password) as unknown as { user: any };
                const mappedUser = data?.user ? { ...data.user, role: data.user.role as Role, teamId: data.user.teamId || undefined } : null;
                setUser(mappedUser)
                return { success: true, user: mappedUser }
            } catch (error) {
                console.error("ERROR:", error);
                return {
                    success: false,
                    user: null,
                    error: error instanceof Error ? error.message : "login failed",
                }
            }
        },
        { error: undefined, success: undefined, user: null } as LoginState
    );

    const logout = async () => {
        try {
            const response = await apiClient.logout()
            setUser(null);
            router.push('/')
        } catch (e) {
            console.error("LOGOUT_ERROR:", e);
        }
    }

    const hasPermission = (requiredRole: Role): boolean => {
        if (!user) return false

        const roleHierarchy: Record<Role, number> = {
            [Role.GUEST]: 0,
            [Role.USER]: 1,
            [Role.MANAGER]: 2,
            [Role.ADMIN]: 3
        };

        return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
    };

    //load user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await apiClient.getCurrentUser();
                const mappedUser = userData ? { ...userData, role: userData.role as Role, teamId: userData.teamId || undefined } : null;
                setUser(mappedUser)
            } catch (e) {
                console.error("Failed to load user:", e)
            }
        };
        loadUser()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            login: loginAction,
            logout,
            hasPermission,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (ctx === undefined) {
        throw new Error(`useAuth must be used within an A=uthProvider `);
    }
    return ctx
}

export default AuthProvider;