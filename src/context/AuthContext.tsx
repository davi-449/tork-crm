"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut, signIn } from "next-auth/react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUser({
                id: (session.user as any).id || '0', // Fallback ID
                name: session.user.name || '',
                email: session.user.email || '',
                role: (session.user as any).role || 'BROKER'
            });
        } else if (status === 'unauthenticated') {
            setUser(null);
        }
    }, [session, status]);

    const login = (token: string, userData: User) => {
        // Legacy support: In NextAuth, login is via signIn()
        // Here we just redirect or ignore since login form uses signIn directly
        console.warn('Legacy login method called. Redirecting to /login');
        router.push('/login');
    };

    const logout = async () => {
        try {
            // 1. Call API to delete cookies on server-side
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include' // Important: Include cookies in request
            });

            // 2. Clear NextAuth session state (without redirect)
            await signOut({ redirect: false });

            // 3. HARD REDIRECT to Landing Page (forces full page reload and cookie cleanup)
            window.location.href = 'https://davicode.me';
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API fails, force redirect
            window.location.href = 'https://davicode.me';
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: status === 'authenticated',
            loading: status === 'loading'
        }}>
            {status === 'loading' ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
