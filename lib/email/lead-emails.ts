'use server';
import { prisma } from '@/lib/prisma';
import { resend } from './resend-client';
import { getGlobalSettings } from '@/lib/actions/config';
import { LeadReplyEmail } from '@/emails/lead-reply-email';
import { LeadConfirmationEmail } from '@/emails/lead-confirmation-email';
import { InternalNewLeadEmail } from '@/emails/internal-new-lead-email';

import { validateAdminAccess } from '@/lib/admin/permissions';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contacto@tudominio.cl';
const INTERNAL_EMAIL = process.env.RESEND_INTERNAL_TO_EMAIL || 'serviciosjess@gmail.com';
const REPLY_TO = process.env.RESEND_REPLY_TO_EMAIL || 'serviciosjess@gmail.com';
const SITE_URL = process.env.SITE_URL || 'https://serviciosjess.cl';

import { 
  ensureLeadInboundCode, 
  ensureSubjectHasLeadCode, 
  buildInboundReplyTo 
} from './inbound-utils';

export async function sendLeadConfirmationEmail(lead: any) {
  if (!resend) return { success: false, error: 'Resend no está configurado.' };

  try {
    const settings = await getGlobalSettings();
    const logoUrl = settings.logoUrl || null;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      replyTo: REPLY_TO,
      subject: 'Recibimos tu solicitud | Servicios Jess',
      react: LeadConfirmationEmail({
        name: lead.name || 'Cliente',
        company: lead.company,
        message: lead.message,
        siteUrl: SITE_URL,
        logoUrl: logoUrl,
      }),
    });

    if (error) {
      await logEmailRecord({
        leadId: lead.id, 
        direction: 'OUTBOUND', 
        subject: 'Recibimos tu solicitud | Servicios Jess', 
        status: 'FAILED', 
        error: error.message, 
        toEmail: lead.email
      });
      return { success: false, error: error.message };
    }

    await logEmailRecord({
      leadId: lead.id, 
      direction: 'OUTBOUND', 
      subject: 'Recibimos tu solicitud | Servicios Jess', 
      status: 'SENT', 
      toEmail: lead.email, 
      resendId: data?.id
    });
    await logActivity(lead.id, 'Correo de confirmación automático enviado al cliente.');
    return { success: true, id: data?.id };
  } catch (err: any) {
    await logEmailRecord({
      leadId: lead.id, 
      direction: 'OUTBOUND', 
      subject: 'Recibimos tu solicitud | Servicios Jess', 
      status: 'FAILED', 
      error: err.message, 
      toEmail: lead.email
    });
    return { success: false, error: err.message };
  }
}

export async function sendInternalNewLeadNotification(lead: any) {
  if (!resend) return { success: false, error: 'Resend no está configurado.' };

  try {
    const settings = await getGlobalSettings();
    const logoUrl = settings.logoUrl || null;

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
        siteUrl: SITE_URL,
        logoUrl: logoUrl,
      }),
    });

    if (error) {
      await logEmailRecord({
        leadId: lead.id, 
        direction: 'INTERNAL', 
        subject: 'Nuevo lead comercial desde la web', 
        status: 'FAILED', 
        error: error.message, 
        toEmail: INTERNAL_EMAIL
      });
      return { success: false, error: error.message };
    }

    await logEmailRecord({
      leadId: lead.id, 
      direction: 'INTERNAL', 
      subject: 'Nuevo lead comercial desde la web', 
      status: 'SENT', 
      toEmail: INTERNAL_EMAIL, 
      resendId: data?.id
    });
    await logActivity(lead.id, 'Notificación interna enviada a Servicios Jess.');
    return { success: true, id: data?.id };
  } catch (err: any) {
    await logEmailRecord({
      leadId: lead.id, 
      direction: 'INTERNAL', 
      subject: 'Nuevo lead comercial desde la web', 
      status: 'FAILED', 
      error: err.message, 
      toEmail: INTERNAL_EMAIL
    });
    return { success: false, error: err.message };
  }
}


export async function sendLeadManualReply({ leadId, subject, body }: { leadId: string, subject: string, body: string }) {
  await validateAdminAccess("OWNER");
  if (!resend) return { success: false, error: 'Resend no está configurado.' };
  if (!body?.trim() || !subject?.trim()) return { success: false, error: 'Asunto y mensaje son requeridos.' };

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { success: false, error: 'Lead no encontrado.' };
  if (!lead.email) return { success: false, error: 'El lead no tiene email.' };

  try {
    const settings = await getGlobalSettings();
    const logoUrl = settings.logoUrl || null;

    const inboundCode = await ensureLeadInboundCode(lead.id);
    const taggedSubject = ensureSubjectHasLeadCode(subject, inboundCode);
    const inboundReplyTo = buildInboundReplyTo(inboundCode);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      replyTo: inboundReplyTo || REPLY_TO,
      subject: taggedSubject,
      react: LeadReplyEmail({
        name: lead.name || 'Cliente',
        message: body,
        siteUrl: SITE_URL,
        logoUrl: logoUrl,
      }),
      text: `Hola ${lead.name || 'Cliente'},\n\n${body}\n\nServicios Jess SpA\nFabricantes de gomas industriales, plásticos de ingeniería y soluciones de maestranza.`,
    });

    if (error) {
      await logEmailRecord({
        leadId: lead.id, 
        direction: 'OUTBOUND', 
        subject: taggedSubject, 
        status: 'FAILED', 
        error: error.message, 
        toEmail: lead.email,
        bodyText: body
      });
      return { success: false, error: error.message };
    }

    await logEmailRecord({
      leadId: lead.id, 
      direction: 'OUTBOUND', 
      subject: taggedSubject, 
      status: 'SENT', 
      toEmail: lead.email, 
      resendId: data?.id, 
      bodyText: body
    });
    await logActivity(lead.id, `Respuesta manual enviada: "${taggedSubject}"`);
    
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
    await logEmailRecord({
      leadId: lead.id, 
      direction: 'OUTBOUND', 
      subject: subject, 
      status: 'FAILED', 
      error: err.message, 
      toEmail: lead.email || 'unknown',
      bodyText: body
    });
    return { success: false, error: err.message };
  }
}


// Helpers
import { logEmailRecord, logActivity } from './lead-email-logging';

// Redundant helpers removed. Use ./templates/utils.ts if needed.
