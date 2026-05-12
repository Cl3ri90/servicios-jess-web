import { prisma } from '@/lib/prisma';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contacto@tudominio.cl';
const REPLY_TO = process.env.RESEND_REPLY_TO_EMAIL || 'serviciosjess@gmail.com';

export async function logEmailRecord({
  leadId,
  direction,
  subject,
  status,
  error,
  toEmail,
  fromEmail,
  replyTo,
  resendId,
  bodyText,
  htmlBody,
  provider = 'resend',
  providerMessageId,
  providerThreadId,
  receivedAt
}: {
  leadId: string;
  direction: string;
  subject: string;
  status: string;
  error?: string | null;
  toEmail: string;
  fromEmail?: string | null;
  replyTo?: string | null;
  resendId?: string | null;
  bodyText?: string;
  htmlBody?: string | null;
  provider?: string;
  providerMessageId?: string | null;
  providerThreadId?: string | null;
  receivedAt?: Date | null;
}) {
  try {
    await prisma.leadEmail.create({
      data: {
        leadId,
        direction,
        subject,
        body: bodyText || '[Contenido automático]',
        htmlBody,
        toEmail,
        fromEmail: fromEmail || FROM_EMAIL,
        replyTo: replyTo || REPLY_TO,
        status,
        error,
        resendId,
        provider,
        providerMessageId,
        providerThreadId,
        receivedAt,
        sentAt: direction === 'OUTBOUND' && status === 'SENT' ? new Date() : null,
      }
    });
  } catch (e) {
    console.error('Error logging email record:', e);
  }
}

export async function logActivity(leadId: string, title: string, type: any = 'CONTACTED', note?: string) {
  try {
    await prisma.leadActivity.create({
      data: {
        leadId,
        type,
        title,
        note,
      }
    });
  } catch (e) {
    console.error('Error logging lead activity:', e);
  }
}
