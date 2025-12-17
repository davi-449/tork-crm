import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Domain configuration
const SITE_DOMAIN = process.env.SITE_DOMAIN || "davicode.me";
const APP_DOMAIN = process.env.APP_DOMAIN || "crm.davicode.me";

export async function middleware(req: NextRequest) {
    const hostname = req.headers.get("host") || "";
    const { pathname } = req.nextUrl;

    // Normalize hostname (remove port for local development)
    const normalizedHost = hostname.split(":")[0];

    console.log(`[MIDDLEWARE] Host: ${normalizedHost}, Path: ${pathname}`);

    // ============================================
    // SITE DOMAIN (Landing Page) - davicode.me
    // ============================================
    if (normalizedHost === SITE_DOMAIN || normalizedHost === "localhost") {
        // On site domain, only allow site routes
        // Block access to app routes from site domain
        if (pathname.startsWith("/dashboard") ||
            pathname.startsWith("/deals") ||
            pathname.startsWith("/leads") ||
            pathname.startsWith("/settings")) {
            // Redirect to CRM domain
            return NextResponse.redirect(`https://${APP_DOMAIN}${pathname}`);
        }

        // For root path on site domain, show landing page
        if (pathname === "/") {
            // Rewrite to (site) route group
            const url = req.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.rewrite(url);
        }

        // Allow all other site routes (privacy, terms, etc)
        return NextResponse.next();
    }

    // ============================================
    // APP DOMAIN (CRM) - crm.davicode.me
    // ============================================
    if (normalizedHost === APP_DOMAIN || normalizedHost.startsWith("crm.")) {
        // Get auth token
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // Public routes in app domain
        const publicPaths = ["/login", "/api/auth"];
        const isPublicPath = publicPaths.some(p => pathname.startsWith(p));

        // If accessing root of CRM domain
        if (pathname === "/") {
            if (token) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            } else {
                return NextResponse.redirect(new URL("/login", req.url));
            }
        }

        // If accessing protected route without token
        if (!isPublicPath && !token) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // If authenticated user tries to access login
        if (pathname === "/login" && token) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    }

    // ============================================
    // LOCAL DEVELOPMENT with port 4000
    // ============================================
    if (hostname.includes("localhost:4000") || hostname.includes("127.0.0.1:4000")) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // Define what's protected
        const protectedPaths = ["/dashboard", "/deals", "/leads", "/settings"];
        const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

        // Check auth for protected paths
        if (isProtectedPath && !token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Redirect authenticated users from login to dashboard
        if (pathname === "/login" && token) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public assets
         * - api routes (except auth which we handle)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
    ],
};
