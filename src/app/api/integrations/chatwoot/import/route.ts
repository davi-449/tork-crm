import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getChatwootContacts } from '@/lib/chatwoot';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const contacts = await getChatwootContacts();
        let imported = 0;

        for (const cwContact of contacts) {
            const { name, email, phone_number } = cwContact;

            if (!phone_number) continue; // CRM requer telefone

            const exists = await prisma.contact.findUnique({ where: { phone: phone_number } });

            if (exists) {
                // Update se tiver dados novos
                await prisma.contact.update({
                    where: { id: exists.id },
                    data: {
                        name: name || exists.name,
                        email: email || exists.email
                    }
                });
            } else {
                await prisma.contact.create({
                    data: {
                        name: name || 'Sem Nome',
                        phone: phone_number,
                        email: email,
                        type: 'PF'
                    }
                });
                imported++;
            }
        }

        return NextResponse.json({
            success: true,
            imported,
            total_scanned: contacts.length,
            message: `Importação concluída. ${imported} novos contatos.`
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
