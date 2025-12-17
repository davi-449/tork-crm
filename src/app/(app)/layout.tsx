import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/layout/ClientLayout'
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Tork CRM',
    description: 'Gestão Inteligente para Corretores de Seguros',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={`${inter.className} min-h-screen bg-zinc-950 text-white`}>
            <SessionProviderWrapper>
                <AuthProvider>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </AuthProvider>
            </SessionProviderWrapper>
        </div>
    )
}
