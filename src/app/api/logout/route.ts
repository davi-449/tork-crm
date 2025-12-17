import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Logout API - Deletes all authentication cookies
 * Supports both GET and POST methods
 */
async function handleLogout() {
    const cookieStore = cookies();

    // Cookie options for .davicode.me domain (with leading dot)
    const rootDomainOptions = {
        domain: '.davicode.me',
        path: '/',
        maxAge: 0,
        secure: true,
        httpOnly: true,
        sameSite: 'lax' as const
    };

    // Cookie options without domain (for local cookies)
    const localOptions = {
        path: '/',
        maxAge: 0
    };

    // List of all possible cookie names to delete
    const cookieNames = [
        'next-auth.session-token',
        'next-auth.csrf-token',
        'next-auth.callback-url',
        '__Secure-next-auth.session-token',
        '__Host-next-auth.csrf-token',
        '_chatwoot_session',
        'crm_token',
        'chatwoot_token'
    ];

    // Delete each cookie with BOTH domain configurations
    cookieNames.forEach(name => {
        try {
            // Delete with root domain
            cookieStore.delete(name);

            // Also try setting to empty with full options (some browsers need this)
            cookieStore.set(name, '', rootDomainOptions);
            cookieStore.set(name, '', localOptions);
        } catch (error) {
            console.error(`Failed to delete cookie ${name}:`, error);
        }
    });

    return NextResponse.json({
        success: true,
        message: 'Logged out successfully'
    });
}

export async function GET() {
    return handleLogout();
}

export async function POST() {
    return handleLogout();
}

