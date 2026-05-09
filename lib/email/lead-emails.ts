'use server';
import { prisma } from '@/lib/prisma';
import { resend } from './resend-client';
import { LeadConfirmationEmail } from '@/emails/lead-confirmation-email';
import { InternalNewLeadEmail } from '@/emails/internal-new-lead-email';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contacto@tudominio.cl';
const INTERNAL_EMAIL = process.env.RESEND_INTERNAL_TO_EMAIL || 'serviciosjess@gmail.com';
const REPLY_TO = process.env.RESEND_REPLY_TO_EMAIL || 'serviciosjess@gmail.com';

export async function sendLeadConfirmationEmail(lead: any) {
  if (!resend) return { success: false, error: 'Resend no está configurado.' };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      replyTo: REPLY_TO,
      subject: 'Recibimos tu solicitud | Servicios Jess',
      react: LeadConfirmationEmail({
        name: lead.name || 'Cliente',
        company: lead.company,
        message: lead.message,
      }),
    });

    if (error) {
      await logEmailRecord(lead.id, 'OUTBOUND', 'Recibimos tu solicitud | Servicios Jess', 'FAILED', error.message, lead.email);
      return { success: false, error: error.message };
    }

    await logEmailRecord(lead.id, 'OUTBOUND', 'Recibimos tu solicitud | Servicios Jess', 'SENT', null, lead.email, data?.id);
    await logActivity(lead.id, 'Correo de confirmación automático enviado al cliente.');
    return { success: true, id: data?.id };
  } catch (err: any) {
    await logEmailRecord(lead.id, 'OUTBOUND', 'Recibimos tu solicitud | Servicios Jess', 'FAILED', err.message, lead.email);
    return { success: false, error: err.message };
  }
}

export async function sendInternalNewLeadNotification(lead: any) {
  if (!resend) return { success: false, error: 'Resend no está configurado.' };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: INTERNAL_EMAIL,
      subject: 'Nuevo lead comercial desde la web',
      react: InternalNewLeadEmail({
        id: lead.id,
        name: lead.name || 'Sin nombre',
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        source: lead.source,
        pageUrl: lead.pageUrl,
        score: lead.score,
        priority: lead.priority,
        createdAt: lead.createdAt,
      }),
    });

    if (error) {
      await logEmailRecord(lead.id, 'INTERNAL', 'Nuevo lead comercial desde la web', 'FAILED', error.message, INTERNAL_EMAIL);
      return { success: false, error: error.message };
    }

    await logEmailRecord(lead.id, 'INTERNAL', 'Nuevo lead comercial desde la web', 'SENT', null, INTERNAL_EMAIL, data?.id);
    await logActivity(lead.id, 'Notificación interna enviada a Servicios Jess.');
    return { success: true, id: data?.id };
  } catch (err: any) {
    await logEmailRecord(lead.id, 'INTERNAL', 'Nuevo lead comercial desde la web', 'FAILED', err.message, INTERNAL_EMAIL);
    return { success: false, error: err.message };
  }
}

export async function sendLeadManualReply({ leadId, subject, body }: { leadId: string, subject: string, body: string }) {
  if (!resend) return { success: false, error: 'Resend no está configurado.' };

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { success: false, error: 'Lead no encontrado.' };
  if (!lead.email) return { success: false, error: 'El lead no tiene email.' };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      replyTo: REPLY_TO,
      subject: subject,
      html: body.replace(/\n/g, '<br />'), // Simple text-to-html conversion for manual replies
    });

    if (error) {
      await logEmailRecord(lead.id, 'OUTBOUND', subject, 'FAILED', error.message, lead.email, null, body);
      return { success: false, error: error.message };
    }

    await logEmailRecord(lead.id, 'OUTBOUND', subject, 'SENT', null, lead.email, data?.id, body);
    await logActivity(lead.id, `Respuesta manual enviada: "${subject}"`);
    
    // Update lead contact info
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        lastContactedAt: new Date(),
        status: ['NEW', 'OPEN', 'IN_PROGRESS', 'ATTEMPTED_CONTACT'].includes(lead.status) ? 'CONTACTED' : undefined
      }
    });

    return { success: true, id: data?.id };
  } catch (err: any) {
    await logEmailRecord(lead.id, 'OUTBOUND', subject, 'FAILED', err.message, lead.email, null, body);
    return { success: false, error: err.message };
  }
}

// Helpers
async function logEmailRecord(leadId: string, direction: string, subject: string, status: string, error: string | null, toEmail: string, resendId?: string | null, bodyText?: string) {
  try {
    await prisma.leadEmail.create({
      data: {
        leadId,
        direction,
        subject,
        body: bodyText || '[Contenido automático]',
        toEmail,
        fromEmail: FROM_EMAIL,
        replyTo: REPLY_TO,
        status,
        error,
        resendId,
        sentAt: status === 'SENT' ? new Date() : null,
      }
    });
  } catch (e) {
    console.error('Error logging email record:', e);
  }
}

async function logActivity(leadId: string, title: string) {
  try {
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: 'CONTACTED',
        title,
      }
    });
  } catch (e) {
    console.error('Error logging lead activity:', e);
  }
}
