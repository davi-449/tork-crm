"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Zap, Shield, Globe } from "lucide-react";
import { SmartNavbar } from "@/components/landing/SmartNavbar";
import { MegaFooter } from "@/components/landing/MegaFooter";
import { StickyScrollSection } from "@/components/landing/StickyScrollSection";
import { InfrastructureScrollSection } from "@/components/landing/InfrastructureSection";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { FadeInWhenVisible, HoverCard } from "@/components/landing/AnimationWrappers";
import { HeroMockups } from "@/components/landing/HeroMockups";

const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.davicode.me';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
            <SmartNavbar />

            {/* --- HERO SECTION (RESTORED 3D) --- */}
            <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-32 pb-20 lg:perspective-[2000px] overflow-hidden">
                {/* Background Effects (Spotlight) */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[100vw] h-[500px] bg-indigo-500/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-full max-w-[80%] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
                    <FadeInWhenVisible>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-sm font-medium text-slate-300">Tork v2.0</span>
                        </div>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.1}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
                            A espinha dorsal da <br />
                            sua operação de seguros.
                        </h1>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.2}>
                        <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed mb-8 px-4 font-light">
                            Conecte WhatsApp, CRM e automação em um único fluxo contínuo. Sem complexidade. Apenas resultados.
                        </p>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.3}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-6">
                            <a href={CRM_URL} className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-950 rounded-full font-semibold hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
                                Começar Agora
                            </a>
                            <button className="w-full sm:w-auto px-8 py-3.5 text-slate-300 hover:text-white transition-colors font-medium">
                                Ver Como Funciona
                            </button>
                        </div>
                    </FadeInWhenVisible>
                </div>

                {/* 3D DASHBOARD (Mobile: Flat | Desktop: 3D Tilt) */}
                <motion.div
                    initial={{ opacity: 0, rotateX: 20, y: 100 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                    className="relative mt-20 max-w-6xl w-full px-4 lg:transform-gpu lg:rotate-x-12"
                >
                    <div className="relative rounded-2xl bg-[#0F1117] border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,1)] overflow-hidden">
                        {/* Header do Mockup (Simulação de Browser) */}
                        <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                            </div>
                        </div>

                        {/* Imagem do Dashboard ou Componente */}
                        <div className="relative">
                            <HeroMockups />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                    {/* Sombra de Chão (Grounding) */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-cyan-500/10 blur-[100px] -z-10" />
                </motion.div>
            </section>

            <SectionDivider variant="dark-glow" />

            {/* --- STICKY SCROLL SECTION (Chat) --- */}
            {/* O próprio componente lida com sticky se precisar, mas vamos envelopar caso necessário ou deixar ele fluir */}
            <StickyScrollSection />

            {/* --- ENGINE SECTION (Sticky on Desktop) --- */}
            <section className="relative bg-slate-950 text-white py-32 lg:sticky lg:top-0 lg:z-0 min-h-screen">
                {/* Top Gradient Fade Transition */}
                <div className="absolute -top-32 left-0 w-full h-32 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6">
                    <FadeInWhenVisible>
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                                Motor Proprietário.
                                <br />
                                <span className="text-slate-500">Zero Gambiarras.</span>
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Nossa arquitetura exclusiva garante que cada mensagem, tag e ação seja sincronizada instantaneamente.
                            </p>
                        </div>
                    </FadeInWhenVisible>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                        {/* Feature 1: Inbox Unificado */}
                        <FadeInWhenVisible delay={0.2}>
                            <HoverCard>
                                <div className="bg-slate-900/30 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/50 hover:bg-slate-900/40 transition-all min-h-[400px] flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-500/30">
                                        <Zap className="text-cyan-400" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Inbox Oficial (Zero Gambiarra)</h3>
                                    <p className="text-slate-400 mb-6 flex-1">
                                        Esqueça QR Codes caindo e celulares desligando. Conexão oficial via API do WhatsApp Business. Estabilidade de 99.9% para sua operação não parar nunca.
                                    </p>

                                    {/* Mini Mockup */}
                                    <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 mt-auto">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-200">API Oficial Conectada</div>
                                                <div className="text-[10px] text-slate-500">Latência: 45ms</div>
                                            </div>
                                            <div className="ml-auto px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                Online
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <Shield size={12} className="text-slate-600" />
                                            <span>Criptografia Ponta-a-Ponta</span>
                                        </div>
                                    </div>
                                </div>
                            </HoverCard>
                        </FadeInWhenVisible>

                        {/* Feature 2: Automação Visual */}
                        <FadeInWhenVisible delay={0.3}>
                            <HoverCard>
                                <div className="bg-slate-900/30 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/50 hover:bg-slate-900/40 transition-all min-h-[400px] flex flex-col">
                                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6 border border-violet-500/30">
                                        <Globe className="text-violet-400" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Automação Invisível</h3>
                                    <p className="text-slate-400 mb-6 flex-1">
                                        Você conversa, o Tork trabalha. O sistema identifica intenção de compra, cria o lead e agenda o follow-up automaticamente. Inteligência passiva, sem configurar fluxogramas complexos.
                                    </p>

                                    {/* Automation Visualization */}
                                    <div className="bg-slate-950/50 rounded-xl p-6 border border-white/5 flex items-center justify-between gap-4 mt-auto relative overflow-hidden">
                                        <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none shadow-lg border border-slate-700 w-28 relative z-10">
                                            <div className="h-1.5 w-12 bg-slate-600 rounded mb-2"></div>
                                            <div className="text-[9px] text-slate-400 font-medium leading-tight">Tenho interesse no plano...</div>
                                        </div>
                                        <div className="text-violet-500 animate-pulse relative z-10 flex flex-col items-center">
                                            <Zap size={20} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                                            <div className="text-[8px] font-bold uppercase tracking-widest text-violet-400/50 mt-1">AI</div>
                                        </div>
                                        <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-700 border-l-4 border-l-green-500 w-28 relative z-10 transform translate-x-1 lg:translate-x-0">
                                            <div className="text-[9px] font-bold text-white mb-1">Novo Lead</div>
                                            <div className="h-1.5 w-16 bg-slate-700 rounded mb-2"></div>
                                            <div className="inline-block px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[8px] rounded font-bold uppercase border border-green-500/20">
                                                Alta Prioridade
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            </HoverCard>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* --- INFRASTRUCTURE (Curtain Effect - Restored) --- */}
            {/* InfrastructureScrollSection already handles z-index, but we ensure it works well */}
            <InfrastructureScrollSection />

            {/* --- CTA FINAL (Event Horizon) --- */}
            {/* Ensure slight overlap/transition */}
            <SectionDivider variant="light-to-dark" className="z-20 relative -mb-1" />

            <section className="relative py-32 bg-slate-950 overflow-hidden">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-violet-600/20 blur-[150px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center px-6">
                    <FadeInWhenVisible>
                        <h2 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                            O futuro da sua <br /> corretora é agora.
                        </h2>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.2}>
                        <p className="text-xl text-zinc-400 max-w-xl mx-auto mb-12 leading-relaxed">
                            Sem cartão de crédito necessário no início. Setup em 2 minutos.
                            Junte-se à elite do mercado.
                        </p>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.4}>
                        <div className="flex flex-col items-center gap-6">
                            <a
                                href={CRM_URL}
                                className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-white px-12 font-medium text-slate-950 transition-all duration-300 hover:bg-zinc-200 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                            >
                                <span className="relative z-10 text-lg font-bold mr-2">Começar Gratuitamente</span>
                                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent z-0 opacity-50" />
                            </a>
                            <span className="text-sm text-zinc-600">
                                Disponível para Web, iOS e Android.
                            </span>
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>

            <MegaFooter />
        </div>
    );
}
