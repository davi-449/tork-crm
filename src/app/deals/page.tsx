import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { PrismaClient } from '@prisma/client';
import KanbanBoard from '@/components/crm/KanbanBoard';

export const dynamic = 'force-dynamic';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

async function getDealsAndStages() {
    const deals = await prisma.deal.findMany({
        include: {
            contact: {
                select: { name: true, phone: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const stages = await prisma.pipelineStage.findMany({
        orderBy: { order: 'asc' }
    });

    const formattedDeals = deals.map(deal => ({
        ...deal,
        value: deal.value !== null ? Number(deal.value) : null,
        createdAt: deal.createdAt.toISOString(),
        renewalDate: deal.renewalDate?.toISOString(),
        contact: {
            ...deal.contact,
            email: deal.contact.email ?? undefined
        }
    }));

    return { deals: formattedDeals, stages };
}

export default async function DealsPage() {
    const { deals, stages } = await getDealsAndStages();

    return (
        <ProtectedRoute>
            <div className="p-4 md:p-6 h-[calc(100vh-2rem)] flex flex-col space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">Pipeline de Vendas</h1>
                        <p className="text-gray-500 mt-1 text-sm">Gerencie seus negócios e oportunidades</p>
                    </div>
                </div>

                {/* Kanban Container */}
                <div className="flex-1 overflow-hidden">
                    <KanbanBoard initialDeals={deals} initialStages={stages} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
