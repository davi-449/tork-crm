import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET || 'tork-crm-secret-key';
const CHATWOOT_API_URL = process.env.CHATWOOT_API_URL || 'http://bot-chatwoot-rails-1:3000';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const email = username; // Form sends "username" but we use email

        // Step 1: Authenticate via Chatwoot API
        console.log(`[SSO] Attempting Chatwoot auth for: ${email}`);

        const chatwootResponse = await fetch(`${CHATWOOT_API_URL}/auth/sign_in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!chatwootResponse.ok) {
            console.log(`[SSO] Chatwoot auth failed: ${chatwootResponse.status}`);
            return NextResponse.json(
                { error: 'Credenciais inválidas no Tork/Chatwoot' },
                { status: 401 }
            );
        }

        // Step 2: Extract user data from Chatwoot response
        const chatwootData = await chatwootResponse.json();
        const chatwootUser = chatwootData.data;

        console.log(`[SSO] Chatwoot auth success for: ${chatwootUser?.email || email}`);

        // Step 3: Upsert user in local CRM database
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                name: chatwootUser?.name || chatwootUser?.display_name || email.split('@')[0],
            },
            create: {
                email: email,
                name: chatwootUser?.name || chatwootUser?.display_name || email.split('@')[0],
                password: 'SSO_CHATWOOT_MANAGED', // Placeholder - real auth is via Chatwoot
                role: chatwootUser?.role === 'administrator' ? 'ADMIN' : 'BROKER',
            },
        });

        console.log(`[SSO] User synced to CRM: ${user.id}`);

        // Step 4: Generate CRM JWT
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new jose.SignJWT({ id: user.id, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('8h')
            .sign(secret);

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error: any) {
        console.error('[SSO] Login error:', error);
        return NextResponse.json(
            { error: 'Erro interno no login SSO' },
            { status: 500 }
        );
    }
}
