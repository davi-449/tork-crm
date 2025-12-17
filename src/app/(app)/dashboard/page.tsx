import { PrismaClient } from '@prisma/client';
import { DollarSign, UserCheck, RefreshCw, TrendingUp, Activity, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

async function getDashboardData() {
    const wonDeals = await prisma.deal.aggregate({
        where: { stage: 'GANHO' },
        _sum: { value: true },
        _count: { id: true }
    });

    const activeDealsCount = await prisma.deal.count({
        where: {
            stage: { in: ['NOVO', 'COTACAO'] },
            status: 'ACTIVE'
        }
    });

    const today = new Date();
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const renewalsCount = await prisma.deal.count({
        where: {
            renewalDate: {
                gte: today,
                lte: next30Days
            }
        }
    });

    const latestDeals = await prisma.deal.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { contact: { select: { name: true } } }
    });

    const totalDeals = await prisma.deal.count();
    const conversionRate = totalDeals > 0 ? ((wonDeals._count.id / totalDeals) * 100).toFixed(0) : 0;

    return {
        metrics: {
            totalRevenue: wonDeals._sum.value ? Number(wonDeals._sum.value) : 0,
            activeLeads: activeDealsCount,
            renewals: renewalsCount,
            conversionRate: conversionRate
        },
        activities: latestDeals
    };
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const data = await getDashboardData();
    const { metrics, activities } = data;

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Sidebar would go here */}
            <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Bem-vindo, {session.user?.name || 'Corretor'}
                        </h1>
                        <p className="text-zinc-500 mt-1">Visão geral do seu pipeline</p>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 text-sm">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Vendas (Total)"
                        value={`R$ ${metrics.totalRevenue.toLocaleString('pt-BR', { notation: 'compact' })}`}
                        subValue="Negócios ganhos"
                        icon={<DollarSign size={20} />}
                        color="emerald"
                    />
                    <StatCard
                        title="Em Negociação"
                        value={metrics.activeLeads}
                        subValue="Leads no funil"
                        icon={<UserCheck size={20} />}
                        color="blue"
                    />
                    <StatCard
                        title="Renovações"
                        value={metrics.renewals}
                        subValue="Próximos 30 dias"
                        icon={<RefreshCw size={20} />}
                        color="amber"
                    />
                    <StatCard
                        title="Taxa Conversão"
                        value={`${metrics.conversionRate}%`}
                        subValue="Ganho / Total"
                        icon={<TrendingUp size={20} />}
                        color="purple"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pipeline CTA */}
                    <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                            <BarChart3 size={28} className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Seu Pipeline está Ativo</h3>
                        <p className="text-zinc-400 max-w-md mb-6">
                            Acesse o Quadro Kanban para visualizar e mover os cards entre as etapas.
                        </p>
                        <Link href="/deals" className="btn-primary">
                            <Zap size={18} />
                            Acessar Kanban
                        </Link>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Activity size={18} className="text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
                        </div>
                        <div className="space-y-4">
                            {activities.map((deal) => (
                                <div key={deal.id} className="flex gap-3 items-start pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
                                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${deal.stage === 'GANHO' ? 'bg-emerald-400' :
                                            deal.stage === 'PERDIDO' ? 'bg-red-400' : 'bg-blue-400'
                                        }`} />
                                    <div>
                                        <p className="text-sm text-zinc-300">
                                            {deal.stage === 'NOVO' ? 'Novo lead:' : 'Negócio atualizado:'}{' '}
                                            <span className="text-white font-medium">{deal.contact.name}</span>
                                        </p>
                                        <p className="text-xs text-zinc-500 capitalize mt-0.5">
                                            {deal.insuranceType.toLowerCase()} • {new Date(deal.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {activities.length === 0 && (
                                <p className="text-zinc-500 text-sm italic text-center py-4">Nenhuma atividade recente.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subValue, icon, color }: any) {
    const colorStyles: any = {
        blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        purple: { icon: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    };
    const style = colorStyles[color] || colorStyles.blue;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <p className="text-zinc-400 text-sm font-medium">{title}</p>
                <div className={`p-2 rounded-lg ${style.bg} ${style.border} border ${style.icon}`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            {subValue && <p className="text-xs text-zinc-500 mt-1">{subValue}</p>}
        </div>
    );
}
