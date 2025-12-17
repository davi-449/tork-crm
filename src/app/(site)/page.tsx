"use client";

import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { AnimatedGradientBackground } from '@/components/landing/AnimatedGradientBackground';
import { HeroMockups } from '@/components/landing/HeroMockups';
import { FadeInWhenVisible, HoverCard } from '@/components/landing/AnimationWrappers';
import { TorkLogo } from '@/components/landing/TorkLogo';
import { StickyScrollSection } from '@/components/landing/StickyScrollSection';

const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.davicode.me';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
            {/* Smart Navbar - Changes on scroll */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/tork-logo.png"
                            alt="Tork"
                            className="w-9 h-9 object-contain"
                        />
                        <span className="text-lg font-bold tracking-tight">Tork</span>
                    </div>
                    <a
                        href={CRM_URL}
                        className="px-6 py-2.5 bg-white text-slate-950 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                    >
                        Acessar Plataforma
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
                <AnimatedGradientBackground />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
                    {/* Left: Text */}
                    <div>
                        <FadeInWhenVisible>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                                    Sincronização Real
                                </span>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.1}>
                            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                                    A Nova Espinha
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                                    Dorsal da sua
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400">
                                    Corretora.
                                </span>
                            </h1>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.2}>
                            <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-lg">
                                Sincronização Bidirecional Real. Tork unifica seu WhatsApp e seu CRM em um núcleo único.
                            </p>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.3}>
                            <div className="flex flex-wrap gap-4">
                                {/* Haptic CTA Button */}
                                <a
                                    href={CRM_URL}
                                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-b from-white via-white to-gray-100 text-slate-950 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/20 hover:shadow-white/30 border-t border-white/20"
                                >
                                    Começar Agora
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </a>
                                <button className="px-8 py-4 border border-white/10 rounded-full font-semibold hover:bg-white/5 hover:scale-105 active:scale-95 transition-all">
                                    Ver Demonstração
                                </button>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.4}>
                            <div className="mt-12 flex items-center gap-8 text-sm text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-green-400" />
                                    <span>100% Seguro</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={16} className="text-yellow-400" />
                                    <span>Sync em Tempo Real</span>
                                </div>
                            </div>
                        </FadeInWhenVisible>
                    </div>

                    {/* Right: Mockups */}
                    <FadeInWhenVisible delay={0.5}>
                        <HeroMockups />
                    </FadeInWhenVisible>
                </div>
            </section>

            {/* Sticky Scroll Conversation Section */}
            <StickyScrollSection />

            {/* Slash Transition */}
            <div className="relative h-24 bg-gradient-to-b from-slate-950 to-zinc-50">
                <svg
                    className="absolute bottom-0 w-full h-24"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 0 L1200 60 L1200 120 L0 120 Z"
                        fill="#f9fafb"
                    />
                </svg>
            </div>

            {/* Engine Section (Light Background) */}
            <section className="relative bg-zinc-50 text-slate-950 py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeInWhenVisible>
                        <div className="text-center mb-20">
                            <h2 className="text-5xl font-bold tracking-tighter mb-4">
                                Motor Proprietário.
                                <br />
                                <span className="text-zinc-500">Zero Gambiarras.</span>
                            </h2>
                            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                                Nossa arquitetura exclusiva garante que cada mensagem, tag e ação seja sincronizada instantaneamente.
                            </p>
                        </div>
                    </FadeInWhenVisible>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                        {/* Feature 1: Inbox Unificado */}
                        <FadeInWhenVisible delay={0.2}>
                            <HoverCard>
                                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-6">
                                        <Zap className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Inbox Omnicanal Unificado</h3>
                                    <p className="text-zinc-600 mb-6">
                                        Gerencie múltiplos atendentes e números de WhatsApp em uma única interface. Tags automáticas, roteamento inteligente.
                                    </p>

                                    {/* Mini Mockup */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-green-400" />
                                            <div>
                                                <div className="text-xs font-semibold">Cliente Automático</div>
                                                <div className="text-[10px] text-zinc-500">● Respondido em 1.2s</div>
                                            </div>
                                            <div className="ml-auto px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-[10px] font-semibold">
                                                Lead Quente
                                            </div>
                                        </div>
                                        <div className="text-xs text-zinc-700 bg-white rounded p-2 border border-gray-200">
                                            "Mensagem sincronizada automaticamente com o CRM"
                                        </div>
                                    </div>
                                </div>
                            </HoverCard>
                        </FadeInWhenVisible>

                        {/* Feature 2: Automação Visual */}
                        <FadeInWhenVisible delay={0.3}>
                            <HoverCard>
                                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mb-6">
                                        <Globe className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Tork Automation Flow</h3>
                                    <p className="text-zinc-600 mb-6">
                                        Crie fluxos complexos de follow-up e renovação sem código. Nosso motor visual proprietário faz o trabalho pesado.
                                    </p>

                                    {/* Automation Nodes Visualization */}
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative h-40">
                                        <svg className="w-full h-full">
                                            {/* Lines */}
                                            <line x1="20" y1="70" x2="180" y2="70" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 2" />
                                            <line x1="180" y1="70" x2="340" y2="70" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 2" />

                                            {/* Node 1 */}
                                            <circle cx="20" cy="70" r="12" fill="#8b5cf6" />
                                            <text x="20" y="95" fontSize="10" fill="#6b7280" textAnchor="middle">Trigger</text>

                                            {/* Node 2 */}
                                            <circle cx="180" cy="70" r="12" fill="#06b6d4" className="animate-pulse" />
                                            <text x="180" y="95" fontSize="10" fill="#6b7280" textAnchor="middle">Ação</text>

                                            {/* Node 3 */}
                                            <circle cx="340" cy="70" r="12" fill="#10b981" />
                                            <text x="340" y="95" fontSize="10" fill="#6b7280" textAnchor="middle">Resultado</text>
                                        </svg>
                                    </div>
                                </div>
                            </HoverCard>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* Slash Transition (Reverse) */}
            <div className="relative h-24 bg-gradient-to-b from-zinc-50 to-slate-950">
                <svg
                    className="absolute top-0 w-full h-24"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 60 L1200 0 L1200 120 L0 120 Z"
                        fill="#0f172a"
                    />
                </svg>
            </div>

            {/* Global Scale Section (Dark) */}
            <section className="relative bg-slate-950 py-32">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <FadeInWhenVisible>
                        <h2 className="text-5xl font-bold tracking-tighter mb-6">
                            Construído para escala global.
                        </h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-16">
                            Infraestrutura robusta que cresce com o seu negócio.
                        </p>
                    </FadeInWhenVisible>

                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <FadeInWhenVisible delay={0.1}>
                            <HoverCard>
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                                    <div className="text-5xl font-bold text-cyan-400 mb-2">+1.2s</div>
                                    <div className="text-sm text-zinc-400 uppercase tracking-wider">Latência Zero</div>
                                    <p className="text-zinc-500 mt-4 text-sm">Sincronização em tempo real garantida</p>
                                </div>
                            </HoverCard>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.2}>
                            <HoverCard>
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                                    <div className="text-5xl font-bold text-violet-400 mb-2">100%</div>
                                    <div className="text-sm text-zinc-400 uppercase tracking-wider">Criptografia Local</div>
                                    <p className="text-zinc-500 mt-4 text-sm">Seus dados nunca saem do Brasil</p>
                                </div>
                            </HoverCard>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.3}>
                            <HoverCard>
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                                    <div className="text-5xl font-bold text-green-400 mb-2">99.9%</div>
                                    <div className="text-sm text-zinc-400 uppercase tracking-wider">Uptime SLA</div>
                                    <p className="text-zinc-500 mt-4 text-sm">Infraestrutura enterprise-grade</p>
                                </div>
                            </HoverCard>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative bg-slate-950 py-32 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <FadeInWhenVisible>
                        <h2 className="text-5xl font-bold tracking-tighter mb-6">
                            Pronto para transformar
                            <br />
                            sua operação?
                        </h2>
                        <p className="text-xl text-zinc-400 mb-10">
                            Junte-se às corretoras líderes que já modernizaram seu workflow.
                        </p>
                        {/* Final Haptic CTA */}
                        <a
                            href={CRM_URL}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 border-t border-white/20"
                        >
                            Entrar na Plataforma
                            <ArrowRight size={20} />
                        </a>
                    </FadeInWhenVisible>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm text-zinc-500">
                    <p>© 2024 Tork. Tecnologia Proprietária. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
