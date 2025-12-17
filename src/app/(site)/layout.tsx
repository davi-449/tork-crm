import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tork - Sincronização Real para Corretoras',
    description: 'Plataforma unificada para corretores de seguros. Sincronize seu WhatsApp e CRM em tempo real.',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}

