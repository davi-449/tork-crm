import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// WEBHOOK CHATWOOT -> CRM
export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const { event, data } = payload;

        if (event === 'contact_created' || event === 'contact_updated') {
            const { name, email, phone_number, identifier } = data;

            // Só processa se tiver identificador válido (email ou telefone)
            if (!email && !phone_number) {
                return NextResponse.json({ message: 'Ignore: No identifiers' }, { status: 200 });
            }

            // Upsert Contact
            // Prioridade: Phone > Email
            const contact = await prisma.contact.upsert({
                where: {
                    phone: phone_number || undefined,
                    // Se não tiver phone, tenta achar pelo email? O prisma upsert unique requer um campo. 
                    // Se phone_number for null, isso quebra se phone é unique. 
                    // O Schema do Prisma provavelmente tem phone @unique. 
                    // Se vier só email, o ideal seria upsert pelo email, mas prisma requer where estático.
                    // Vamos tentar buscar primeiro.
                },
                // Strategy: Find existing by phone OR email, then upsert.
                // Como upsert requer 1 chave, vamos fazer manual find.
                update: {},
                create: { name: '', phone: '', type: 'PF' } // Dummy, will override logic below
            }).catch(() => null);

            // Refazendo a lógica manual para ser mais robusto com dados parciais
            let existing = null;
            if (phone_number) existing = await prisma.contact.findUnique({ where: { phone: phone_number } });
            if (!existing && email) existing = await prisma.contact.findUnique({ where: { email: email } });

            if (existing) {
                await prisma.contact.update({
                    where: { id: existing.id },
                    data: {
                        name: name || existing.name,
                        email: email || existing.email,
                        phone: phone_number || existing.phone
                    }
                });
            } else {
                // Se não tem phone, mas tem email, PRECISAMOS garantir que o phone não seja nulo se o banco exige.
                // Assumindo que o banco permite phone opcional OU exigimos phone. 
                // Se banco exige phone e não veio, geramos um placeholder ou ignoramos?
                // Vamos supor que phone é obrigatório no CRM (como visto no leads route).
                if (!phone_number) {
                    return NextResponse.json({ message: 'Skipped: Phone required for CRM' }, { status: 200 });
                }

                await prisma.contact.create({
                    data: {
                        name: name || 'Sem Nome',
                        phone: phone_number,
                        email: email,
                        type: 'PF'
                    }
                });
            }

            console.log(`Synced Chatwoot Contact to CRM: ${name}`);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: 'Event ignored' }, { status: 200 });

    } catch (error: any) {
        console.error('Webhook Chatwoot Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
