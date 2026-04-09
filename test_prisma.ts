import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
    const b = await prisma.booking.findFirst({
        select: {
            id: true,
            status: true,
            paymentStatus: true
        }
    });
    console.log("TEST RESULT:", b);
}

main().catch(console.error).finally(() => prisma.$disconnect());
