import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    await prisma.user.createMany({
        data: [
            {email: "demo1@example.com", name: "Demo User 1"},
            {email: "demo2@example.com", name: "Demo User 2"},
        ]
    })
}

seed().then(() => prisma.$disconnect());