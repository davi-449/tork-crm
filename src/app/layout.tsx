import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Tork',
    description: 'Plataforma Unificada para Corretores de Seguros',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body className={`${inter.className} bg-slate-950 text-white antialiased selection:bg-cyan-500 selection:text-white`}>
                {children}
            </body>
        </html>
    )
}
