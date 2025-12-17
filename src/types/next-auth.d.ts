import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            chatwootCookies?: any
        } & DefaultSession["user"]
    }

    interface User {
        role: string
        chatwootCookies?: any
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string
        chatwootCookies?: any
    }
}
