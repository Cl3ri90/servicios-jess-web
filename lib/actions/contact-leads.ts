'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { headers } from 'next/headers'
import { notifyNewLeadCreated } from '@/lib/email/lead-notifications'
import { validateAdminAccess } from '@/lib/admin/permissions'

const contactLeadSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(80, "El nombre es muy largo"),
  company: z.string().max(100).optional().nullish(),
  email: z.string().email("Correo inválido"),
  phone: z.string().max(30).optional().nullish(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(1000, "El mensaje es muy largo"),
  pageUrl: z.string().max(300).optional().nullish(),
  source: z.string().default('contact_form'),
})

export async function createContactLead(formData: FormData) {
  try {
    // 1. Honeypot check
    const website = formData.get('website');
    if (website) {
      // Si el honeypot viene lleno, es un bot. Retornamos éxito silencioso.
      return { success: true, message: 'Su mensaje ha sido enviado exitosamente.' };
    }

    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string | null,
      company: formData.get('company') as string | null,
      message: formData.get('message') as string,
      pageUrl: formData.get('pageUrl') as string | null,
      source: (formData.get('source') as string) || 'contact_form',
    }

    const { success, data, error } = contactLeadSchema.safeParse(rawData)

    if (!success) {
      return { success: false, error: 'Datos de formulario inválidos. Por favor revisa los campos requeridos.' }
    }

    // 2. Extraer Headers
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 3. Rate Limiting Básico
    // Bloquearemos si hay más de 3 leads en los últimos 10 minutos con el mismo email o IP.
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    // FUTURE RATE LIMITING
    // Para producción con mayor tráfico, integrar Upstash Redis, Vercel KV o un servicio equivalente para rate limiting por IP/email.

    const recentLeadsCount = await prisma.lead.count({
      where: {
        OR: [
          { email: data.email },
          { ipAddress: ipAddress !== 'unknown' ? ipAddress : undefined }
        ],
        createdAt: {
          gte: tenMinutesAgo
        }
      }
    });

    if (recentLeadsCount >= 3) {
      return {
        success: false,
        error: "Hemos recibido varias solicitudes recientes. Intenta nuevamente más tarde.",
      };
    }

    // 4. Guardar Lead
    const newLead = await prisma.lead.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        message: data.message,
        pageUrl: data.pageUrl,
        source: data.source,
        status: 'NEW',
        priority: 'NORMAL',
        userAgent,
        ipAddress,
      }
    });

    // 5. Notificación futura
    await notifyNewLeadCreated(newLead);

    // 6. Revalidar
    revalidatePath('/admin/developer/leads');
    revalidatePath('/admin/owner/leads');

    return { success: true, message: 'Solicitud enviada correctamente. Nuestro equipo se pondrá en contacto contigo.' }
  } catch (error) {
    console.error('Lead Error:', error)
    return { success: false, error: 'Ocurrió un error al enviar el mensaje. Intente de nuevo más tarde.' }
  }
}

export async function getContactLeads() {
  await validateAdminAccess("DEVELOPER"); // o validación custom si ambos roles pueden ver
  return prisma.lead.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateContactLeadStatus(id: string, newStatus: string) {
  try {
    await validateAdminAccess("OWNER");
    await prisma.lead.update({
      where: { id },
      data: { status: newStatus }
    });
    revalidatePath('/admin/developer/leads');
    revalidatePath('/admin/owner/leads');
    return { success: true, message: 'Estado actualizado' }
  } catch (error) {
    return { success: false, error: 'Error actualizando estado' }
  }
}

export async function updateContactLeadPriority(id: string, priority: string) {
  try {
    await validateAdminAccess("OWNER");
    await prisma.lead.update({
      where: { id },
      data: { priority }
    });
    revalidatePath('/admin/developer/leads');
    revalidatePath('/admin/owner/leads');
    return { success: true, message: 'Prioridad actualizada' }
  } catch (error) {
    return { success: false, error: 'Error actualizando prioridad' }
  }
}

export async function updateContactLeadNote(id: string, internalNote: string) {
  try {
    await validateAdminAccess("OWNER");
    await prisma.lead.update({
      where: { id },
      data: { internalNote }
    });
    revalidatePath('/admin/developer/leads');
    revalidatePath('/admin/owner/leads');
    return { success: true, message: 'Nota interna actualizada' }
  } catch (error) {
    return { success: false, error: 'Error actualizando nota' }
  }
}

export async function archiveContactLead(id: string) {
  try {
    await validateAdminAccess("OWNER");
    await prisma.lead.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });
    revalidatePath('/admin/developer/leads');
    revalidatePath('/admin/owner/leads');
    return { success: true, message: 'Lead archivado' }
  } catch (error) {
    return { success: false, error: 'Error archivando lead' }
  }
}
