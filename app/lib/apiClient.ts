import { User } from "@prisma/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
        const url = `${this.baseUrl}${endpoint}`;
        const config: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            credentials: "include",
            ...options,
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            return null;
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Network error " }));
            throw new Error(error.error || "Request failed")
        }
        return await response.json()
    }

    //auth
    async register(userData: unknown) {
        return this.request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    }
    async login(email: string, password: string) {
        return this.request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    }

    async logout() {
        return this.request("/api/auth/logout", {
            method: "POST",
        });
    }

    async getCurrentUser() {
        return this.request<User>("/api/auth/me");
    }

    //user
    async getUsers() {
        return this.request("/api/users");
    }
    //admin
    async updateUserRole(userId: string, role: string) {
        return this.request(`/api/users/${userId}/role`, {
            method: "PATCH",
            body: JSON.stringify({ role }),
        });
    }

    async assignUserToTeam(userId: string, teamId: string) {
        return this.request(`/api/users/${userId}/team`, {
            method: "PATCH",
            body: JSON.stringify({ teamId }),
        });
    }
}

export const apiClient = new ApiClient();