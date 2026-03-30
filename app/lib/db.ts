import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        await prisma.$queryRaw`Select 1`;
        return true
    } catch (error) {
        console.error("Databses connection failed", error)
        return false;
    }
}