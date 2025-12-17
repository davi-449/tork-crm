"use client";

import { motion } from 'framer-motion';

export function HeroMockups() {
    return (
        <div className="relative w-full h-[500px] perspective-1000">
            {/* Connection Beam */}
            <motion.div
                className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 blur-sm"
                animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scaleX: [0.8, 1, 0.8],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* WhatsApp Mobile Mockup (Left) */}
            <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-[480px]"
                style={{ transform: "rotateY(-12deg) rotateX(6deg)" }}
                initial={{ opacity: 0, x: -50 }}
                animate={{
                    opacity: 1,
                    x: 0,
                    y: [0, -15, 0] // Floating animation
                }}
                transition={{
                    opacity: { duration: 0.8 },
                    x: { duration: 0.8 },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                {/* Colored glow shadow */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-cyan-500/20 blur-3xl -z-10" />

                <div className="relative w-full h-full bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    {/* Mobile Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl" />

                    {/* Chat Header */}
                    <div className="mt-8 px-4 py-3 border-b border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30" />
                        <div>
                            <div className="text-xs font-medium text-white">Cliente 1</div>
                            <div className="text-[10px] text-green-400">● Online</div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4 space-y-3">
                        <div className="bg-zinc-700/50 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                            <p className="text-xs text-zinc-300">Olá! Gostaria de uma cotação.</p>
                        </div>
                        <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%] ml-auto">
                            <p className="text-xs text-cyan-100">Claro! Já estou preparando...</p>
                        </div>
                    </div>

                    {/* Tag Badge */}
                    <motion.div
                        className="absolute bottom-20 right-4 px-2 py-1 bg-violet-500/20 border border-violet-500/30 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-[10px] text-violet-300">🏷️ Lead Quente</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* CRM Dashboard Mockup (Right) */}
            <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-64"
                style={{ transform: "rotateY(12deg) rotateX(-6deg)" }}
                initial={{ opacity: 0, x: 50 }}
                animate={{
                    opacity: 1,
                    x: 0,
                    y: [0, -12, 0] // Floating animation (slightly different phase)
                }}
                transition={{
                    opacity: { duration: 0.8, delay: 0.2 },
                    x: { duration: 0.8, delay: 0.2 },
                    y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
            >
                {/* Colored glow shadow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 blur-3xl -z-10" />

                <div className="relative w-full h-full bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    {/* Dashboard Header */}
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <div className="text-xs font-bold text-white">Tork</div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                        </div>
                    </div>

                    {/* Kanban Columns */}
                    <div className="p-3 grid grid-cols-3 gap-2 h-full">
                        {['Novo', 'Negociação', 'Fechado'].map((stage, i) => (
                            <div key={stage} className="bg-zinc-800/50 rounded-lg p-2">
                                <div className="text-[10px] text-zinc-400 mb-2 font-medium">{stage}</div>
                                {Array.from({ length: 2 }).map((_, j) => (
                                    <motion.div
                                        key={j}
                                        className="mb-2 bg-zinc-700/50 rounded p-2 border border-white/5"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + (i * 0.1) + (j * 0.05) }}
                                    >
                                        <div className="w-full h-1 bg-cyan-500/30 rounded mb-1" />
                                        <div className="w-3/4 h-1 bg-zinc-600 rounded" />
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
