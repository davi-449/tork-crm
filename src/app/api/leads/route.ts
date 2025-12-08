import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createChatwootContact } from '@/lib/chatwoot';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nome, telefone, email, tipo_seguro, resumo, dados_extras, valor_estimado } = body;

        // Validação de Dados Críticos
        if (!telefone) {
            return NextResponse.json({ error: 'Telefone é obrigatório para deduplicação' }, { status: 400 });
        }

        // Operação Atômica: Upsert Contato + Criar Negócio
        const result = await prisma.$transaction(async (tx) => {
            const contact = await tx.contact.upsert({
                where: { phone: telefone },
                update: {
                    name: nome,
                    email: email || undefined,
                },
                create: {
                    name: nome,
                    phone: telefone,
                    email: email,
                    type: 'PF',
                },
            });

            const deal = await tx.deal.create({
                data: {
                    title: resumo ?? `${tipo_seguro || 'Seguro'} - ${nome}`,
                    contactId: contact.id,
                    stage: 'NOVO',
                    insuranceType: tipo_seguro || 'OUTROS',
                    value: valor_estimado ? parseFloat(valor_estimado) : undefined,
                    priority: 'HIGH',
                    // Mapeia renovação explicitamente se existir no payload
                    renewalDate: dados_extras?.renovacao ? new Date(dados_extras.renovacao) : undefined,
                    insuranceData: dados_extras || {},
                    status: 'ACTIVE'
                },
            });

            return { contact, deal };
        });

        // Integração Chatwoot (Outbound Sync) - Fire and Forget
        // Não esperamos o await para não travar a resposta do webhook do lead
        createChatwootContact(nome, email, telefone).catch(err => console.error("Falha background Chatwoot Sync:", err));

        return NextResponse.json({
            success: true,
            dealId: result.deal.id,
            contactId: result.contact.id,
            message: 'Lead processado com sucesso no Tork CRM'
        });

    } catch (error: any) {
        console.error('Erro no Webhook Tork:', error);
        return NextResponse.json({ error: 'Erro interno ao processar lead', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    try {
        // Delete related deals first explicitly to ensure cleaning up
        await prisma.deal.deleteMany({
            where: { contactId: id }
        });

        await prisma.contact.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
