import { hashPssword } from "@/app/lib/auth";
import { Role, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("starting db seed...");

    const teams = await Promise.all([
        prisma.team.create({
            data: {
                name: "engineering",
                description: "s/w dev team",
                code: "ENG-2020"
            }
        }),
        prisma.team.create({
            data: {
                name: "Marketing",
                description: "Growth, SEO, and brand awareness",
                code: "MKT-2021"
            }
        }),
        prisma.team.create({
            data: {
                name: "Human Resources",
                description: "Talent acquisition and culture",
                code: "HR-2022"
            }
        }),
        prisma.team.create({
            data: {
                name: "Sales",
                description: "Direct sales and partnerships",
                code: "SLS-2023"
            }
        }),
    ]);

    const sampleUsers = [
        {
            name: "John Manager",
            email: "john@engineering.com",
            teamId: teams[0].id,
            role: Role.MANAGER
        },
        {
            name: "Alice Dev",
            email: "alice@engineering.com",
            teamId: teams[0].id,
            role: Role.USER
        },
        {
            name: "Sarah Growth",
            email: "sarah@marketing.com",
            teamId: teams[1].id,
            role: Role.MANAGER
        },
        {
            name: "Mike Market",
            email: "mike@marketing.com",
            teamId: teams[1].id,
            role: Role.USER
        },
        {
            name: "Emma People",
            email: "emma@hr.com",
            teamId: teams[2].id,
            role: Role.MANAGER
        },
        {
            name: "David Admin",
            email: "admin@company.com",
            teamId: teams[3].id,
            role: Role.ADMIN
        },
        {
            name: "James Sales",
            email: "james@sales.com",
            teamId: teams[3].id,
            role: Role.USER
        }
    ];

    const hashedPassword = await hashPssword("12345");

    for (const userData of sampleUsers) {
        await prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                password: hashedPassword,
                role: userData.role,
                teamId: userData.teamId,
            }
        });
    }

    console.log("Seeding complete! 🌱");
}

main()
    .catch((e) => {
        console.error("seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });