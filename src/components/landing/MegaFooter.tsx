'use client';

import { ArrowRight } from 'lucide-react';
import { FadeInWhenVisible } from './AnimationWrappers';

const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.davicode.me';

export function MegaFooter() {
    return (
        <section className="relative py-40 px-6 overflow-hidden">
            {/* Radial Gradient Background */}
            <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-slate-950 to-slate-950" />

            {/* Decorative Glow Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />

            <div className="relative max-w-5xl mx-auto text-center">
                {/* Mega Headline */}
                <FadeInWhenVisible>
                    <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
                        Pronto para modernizar
                        <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                            sua corretora?
                        </span>
                    </h2>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.1}>
                    <p className="text-xl md:text-2xl text-zinc-400 mb-16 max-w-3xl mx-auto leading-relaxed">
                        Junte-se aos corretores que já eliminaram o caos de múltiplas ferramentas.
                        <br />
                        <span className="text-zinc-500">Tudo em um só lugar. Comece agora.</span>
                    </p>
                </FadeInWhenVisible>

                {/* CTA with Glow Effect */}
                <FadeInWhenVisible delay={0.2}>
                    <div className="relative inline-block">
                        {/* Animated Glow Background */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-violet-600 to-cyan-500 rounded-2xl blur-xl opacity-50 animate-pulse" />

                        <a
                            href={CRM_URL}
                            className="relative group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-lg font-bold rounded-xl transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/60 hover:scale-[1.05]"
                        >
                            Começar Gratuitamente
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </FadeInWhenVisible>

                {/* Trust Badge */}
                <FadeInWhenVisible delay={0.3}>
                    <div className="mt-16 flex items-center justify-center gap-6 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                            <span>Sem cartão de crédito</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            </div>
                            <span>Setup em 5 minutos</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/50 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-violet-500" />
                            </div>
                            <span>Suporte 24/7</span>
                        </div>
                    </div>
                </FadeInWhenVisible>
            </div>

            <style jsx>{`
                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }

                @keyframes gradient-radial {
                    0% {
                        background: radial-gradient(circle at center, rgba(6, 182, 212, 0.2) 0%, rgba(2, 6, 23, 1) 70%);
                    }
                    100% {
                        background: radial-gradient(circle at center, rgba(6, 182, 212, 0.2) 0%, rgba(2, 6, 23, 1) 70%);
                    }
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle at center, rgba(6, 182, 212, 0.2) 0%, rgba(2, 6, 23, 1) 70%);
                }
            `}</style>
        </section>
    );
}
