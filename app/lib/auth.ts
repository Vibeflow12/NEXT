import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { Role, User } from "../types/types";

const JWT_SECRET = process.env.JWT_SECRET!

export const hashPssword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPssword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPssword)
}

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export const verifyToken = (token: string): { userId: string } | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
            return decoded as { userId: string };
        }
        return null;
    } catch (error) {
        console.error("Token verification Failed", error)
        return null
    }
}

export const getCurrent = async (): Promise<User | null> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return null

        const decode = verifyToken(token)

        const userFromDb = await prisma.user.findUnique({
            where: { id: decode?.userId }
        });

        if (!userFromDb) return null
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = userFromDb

        return user as User
    } catch (error) {
        console.error("ERROR:", error)
        return null
    }
};

export const checkUserPermission = (
    user: User,
    requiredRole: Role
): boolean => {
    const roleHierarchy: Record<Role, number> = {
        [Role.GUEST]: 0,
        [Role.USER]: 1,
        [Role.MANAGER]: 2,
        [Role.ADMIN]: 3
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}
