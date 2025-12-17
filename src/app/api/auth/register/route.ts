import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createChatwootUser } from "@/lib/chatwoot";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        console.log(`[REGISTER] Starting registration for ${email}`);

        // 1. Create in Chatwoot (Master Source of Truth for Auth)
        let chatwootUser;
        try {
            chatwootUser = await createChatwootUser({
                name,
                email,
                password,
                role: 'agent' // Default role
            });
            console.log(`[REGISTER] Chatwoot user created: ${chatwootUser?.id}`);
        } catch (cwError: any) {
            // Check if user already exists in Chatwoot (422)
            if (cwError.response?.status === 422) {
                console.warn(`[REGISTER] User likely exists in Chatwoot, proceeding to sync local DB.`);
            } else {
                console.error(`[REGISTER] Chatwoot creation failed:`, cwError.message);
                return NextResponse.json({ error: "Falha ao criar usuário no sistema de atendimento." }, { status: 500 });
            }
        }

        // 2. Create in Local CRM (Prisma)
        const user = await prisma.user.upsert({
            where: { email },
            update: { name }, // Sync name if exists
            create: {
                name,
                email,
                password: "SSO_MANAGED", // Password authentication is handled by Chatwoot
                role: "BROKER"
            }
        });

        console.log(`[REGISTER] CRM user synced: ${user.id}`);

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });

    } catch (error: any) {
        console.error("[REGISTER] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
