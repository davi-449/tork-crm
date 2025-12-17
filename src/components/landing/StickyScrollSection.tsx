'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
    {
        id: 1,
        badge: "Etapa 1 • Captura",
        title: "Captura Automática",
        description: "Toda mensagem do WhatsApp é capturada instantaneamente. Não importa a hora, não importa o volume. Zero leads perdidos."
    },
    {
        id: 2,
        badge: "Etapa 2 • Qualificação",
        title: "Qualificação Inteligente",
        description: "Nosso motor de IA qualifica o lead em tempo real, priorizando intenção de compra e urgência. Seu time só vê oportunidades quentes."
    },
    {
        id: 3,
        badge: "Etapa 3 • Conversão",
        title: "Conversão Instantânea",
        description: "Lead sincronizado ao CRM com contexto completo da conversa. Sua equipe vê tudo e fecha mais rápido."
    }
];

export function StickyScrollSection() {
    const [activeStep, setActiveStep] = useState(0);
    const step1Ref = useRef<HTMLDivElement>(null);
    const step2Ref = useRef<HTMLDivElement>(null);
    const step3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.innerHeight * 0.5;

            if (step1Ref.current) {
                const rect = step1Ref.current.getBoundingClientRect();
                if (rect.top < offset && rect.bottom > offset) {
                    setActiveStep(0);
                }
            }

            if (step2Ref.current) {
                const rect = step2Ref.current.getBoundingClientRect();
                if (rect.top < offset && rect.bottom > offset) {
                    setActiveStep(1);
                }
            }

            if (step3Ref.current) {
                const rect = step3Ref.current.getBoundingClientRect();
                if (rect.top < offset && rect.bottom > offset) {
                    setActiveStep(2);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="relative w-full bg-slate-950">
            {/* Desktop */}
            <div className="hidden lg:flex lg:flex-row max-w-7xl mx-auto px-6 py-24 gap-16">
                {/* Coluna Esquerda - Rola */}
                <div className="w-1/2 flex flex-col">
                    <div ref={step1Ref} className="min-h-screen flex items-center justify-center">
                        <StepContent step={steps[0]} isActive={activeStep === 0} />
                    </div>

                    <div ref={step2Ref} className="min-h-screen flex items-center justify-center">
                        <StepContent step={steps[1]} isActive={activeStep === 1} />
                    </div>

                    <div ref={step3Ref} className="min-h-screen flex items-center justify-center">
                        <StepContent step={steps[2]} isActive={activeStep === 2} />
                    </div>
                </div>

                {/* Coluna Direita - Sticky */}
                <div className="w-1/2">
                    <div className="sticky top-24 flex items-center justify-center h-screen">
                        <IPhoneMockup activeStep={activeStep} />
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden py-20 px-6 space-y-16">
                {steps.map((step, index) => (
                    <div key={step.id} className="space-y-8">
                        <StepContent step={step} isActive={true} />
                        <div className="flex justify-center">
                            <IPhoneMockup activeStep={index} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function StepContent({ step, isActive }: { step: typeof steps[0]; isActive: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-lg"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    {step.badge}
                </span>
            </div>
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                {step.title}
            </h3>
            <p className="text-xl text-zinc-400 leading-relaxed">
                {step.description}
            </p>
        </motion.div>
    );
}

function IPhoneMockup({ activeStep }: { activeStep: number }) {
    const step1Messages = [
        { from: "client", text: "Olá! Gostaria de cotar um seguro auto." }
    ];

    const step2Messages = [
        ...step1Messages,
        { from: "bot", text: "Perfeito! Vou te ajudar. Qual modelo do seu veículo?" },
        { from: "client", text: "Honda Civic 2022" },
        { from: "bot", text: "Ótimo! Vou buscar as melhores opções..." }
    ];

    const step3Messages = [
        ...step2Messages,
        { from: "success", text: "Lead enviado para CRM" }
    ];

    const currentMessages = activeStep === 0 ? step1Messages :
        activeStep === 1 ? step2Messages :
            step3Messages;

    return (
        <div className="relative w-full max-w-[320px]">
            <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl border border-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10" />

                <div className="bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/5 min-h-[600px] flex flex-col">
                    <div className="h-12 px-6 flex items-center justify-between text-xs text-white/80 flex-shrink-0">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-3 border border-white/60 rounded-sm" />
                            <div className="w-3 h-3">📶</div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border-b border-white/5 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                            JD
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-white">João Da Silva</div>
                            <div className="text-xs text-green-400">● online</div>
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-6 space-y-3 overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            {currentMessages.map((message, index) => (
                                <motion.div
                                    key={`${activeStep}-${index}`}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        delay: index * 0.1,
                                        type: "spring",
                                        damping: 25,
                                        stiffness: 200
                                    }}
                                    className={`flex ${message.from === 'client' ? 'justify-end' : message.from === 'success' ? 'justify-center' : 'justify-start'}`}
                                >
                                    {message.from === 'client' && (
                                        <div className="bg-green-600 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%] shadow-lg">
                                            <p className="text-sm text-white">{message.text}</p>
                                        </div>
                                    )}

                                    {message.from === 'bot' && (
                                        <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[75%] shadow-lg">
                                            <p className="text-sm text-white">{message.text}</p>
                                        </div>
                                    )}

                                    {message.from === 'success' && (
                                        <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-green-500/40 flex items-center gap-2 shadow-xl">
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                <Check size={14} className="text-white" />
                                            </div>
                                            <p className="text-sm text-green-100 font-semibold">{message.text}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="bg-slate-900/50 border-t border-white/5 px-4 py-3 flex items-center gap-2 flex-shrink-0">
                        <div className="flex-1 bg-slate-800 rounded-full px-4 py-2">
                            <span className="text-sm text-zinc-500">Digite uma mensagem</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
