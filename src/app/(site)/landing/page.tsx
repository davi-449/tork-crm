import { ArrowRight, ChevronRight } from 'lucide-react';
import { HeroMockups } from '@/components/landing/HeroMockups';
import { AnimatedGradientBackground } from '@/components/landing/AnimatedGradientBackground';
import { FadeInWhenVisible } from '@/components/landing/AnimationWrappers';
import { StickyScrollFeature } from '@/components/landing/StickyScrollFeature';
import { InfiniteLogoTicker } from '@/components/landing/InfiniteLogoTicker';
import { MegaFooter } from '@/components/landing/MegaFooter';

// Domain configuration
const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.davicode.me';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
            {/* Animated Aurora Background */}
            <AnimatedGradientBackground />

            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-slate-950/50 backdrop-blur-xl border-b border-white/5 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-xl flex items-center justify-center">
                            <div className="w-5 h-5 bg-slate-950 rounded-md" />
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Tork
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href={CRM_URL}
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Entrar
                        </a>
                        <a
                            href={CRM_URL}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                        >
                            Acessar Plataforma
                            <ChevronRight size={16} />
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        {/* Badge */}
                        <FadeInWhenVisible>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-600/10 border border-cyan-500/20 mb-8 backdrop-blur-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                                </span>
                                <span className="text-sm bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-semibold">
                                    Plataforma Unificada para Corretores
                                </span>
                            </div>
                        </FadeInWhenVisible>

                        {/* Headline */}
                        <FadeInWhenVisible delay={0.1}>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
                                Atendimento e CRM em
                                <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                                    um só lugar
                                </span>
                            </h1>
                        </FadeInWhenVisible>

                        {/* Subtitle */}
                        <FadeInWhenVisible delay={0.2}>
                            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Conecte seu WhatsApp ao seu CRM. Sincronização em tempo real para fechar mais negócios.
                                <br />
                                <span className="text-zinc-500">Menos abas abertas, mais resultados.</span>
                            </p>
                        </FadeInWhenVisible>

                        {/* CTA Buttons */}
                        <FadeInWhenVisible delay={0.3}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                                <a
                                    href={CRM_URL}
                                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02]"
                                >
                                    Começar Agora
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="#recursos"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all backdrop-blur-sm"
                                >
                                    Ver Recursos
                                </a>
                            </div>
                        </FadeInWhenVisible>
                    </div>

                    {/* Floating Mockups */}
                    <FadeInWhenVisible delay={0.4}>
                        <HeroMockups />
                    </FadeInWhenVisible>
                </div>
            </section>

            {/* Logo Ticker */}
            <InfiniteLogoTicker />

            {/* Sticky Scroll Features (Main Section) */}
            <section id="recursos">
                <StickyScrollFeature />
            </section>

            {/* Mega Footer CTA */}
            <MegaFooter />

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-slate-950 rounded-sm" />
                            </div>
                            <span className="text-sm text-zinc-500">
                                © 2024 Tork. Todos os direitos reservados.
                            </span>
                        </div>
                        <div className="flex items-center gap-8 text-sm text-zinc-400">
                            <a href="/privacy" className="hover:text-white transition-colors">
                                Privacidade
                            </a>
                            <a href="/terms" className="hover:text-white transition-colors">
                                Termos
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
