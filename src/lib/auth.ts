import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CHATWOOT_API_URL = process.env.CHATWOOT_API_URL || 'http://bot-chatwoot-rails-1:3000';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Tork",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('[AUTH] Missing credentials');
                    return null;
                }

                try {
                    // STEP 1: Authenticate directly with Chatwoot API
                    console.log(`[AUTH] Authenticating via Chatwoot: ${credentials.email}`);

                    const chatwootResponse = await fetch(`${CHATWOOT_API_URL}/auth/sign_in`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    });

                    // STEP 2: Check Chatwoot response
                    if (!chatwootResponse.ok) {
                        console.log(`[AUTH] Chatwoot rejected: ${chatwootResponse.status}`);
                        return null; // Invalid credentials
                    }

                    const chatwootData = await chatwootResponse.json();
                    const cwUser = chatwootData.data;

                    if (!cwUser || !cwUser.email) {
                        console.log('[AUTH] Chatwoot returned invalid user data');
                        return null;
                    }

                    console.log(`[AUTH] Chatwoot OK: ${cwUser.email} (${cwUser.role || 'agent'})`);

                    // STEP 3: Upsert user in local CRM database
                    const user = await prisma.user.upsert({
                        where: { email: cwUser.email },
                        update: {
                            name: cwUser.name || cwUser.display_name || cwUser.email.split('@')[0],
                        },
                        create: {
                            email: cwUser.email,
                            name: cwUser.name || cwUser.display_name || cwUser.email.split('@')[0],
                            password: "CHATWOOT_SSO", // Placeholder - real auth is via Chatwoot
                            role: cwUser.role === 'administrator' ? 'ADMIN' : 'BROKER',
                        }
                    });

                    console.log(`[AUTH] CRM user synced: ${user.id}`);

                    // STEP 4: Return user for NextAuth session
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };

                } catch (error: any) {
                    console.error('[AUTH] Error:', error.message);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 hours
    },
    secret: process.env.NEXTAUTH_SECRET || 'tork-secret-change-in-production',
};
