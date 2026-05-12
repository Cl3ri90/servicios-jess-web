import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/email/resend-client';
import { logEmailRecord, logActivity } from '@/lib/email/lead-emails';
import { extractInboundCode } from '@/lib/email/inbound-utils';
import { sanitizeInboundEmailHtml } from '@/lib/security/sanitize-inbound';
import { Webhook } from 'svix';
import { revalidatePath } from 'next/cache';

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  // 1. Verificar existencia de secret en producción
  if (process.env.NODE_ENV === 'production' && !WEBHOOK_SECRET) {
    console.error('[Resend Webhook] Error: RESEND_WEBHOOK_SECRET no configurado.');
    return NextResponse.json({ error: 'Configuración de seguridad faltante' }, { status: 500 });
  }

  // 2. Obtener raw body para verificación de firma
  const payload = await req.text();
  
  // 3. Obtener headers de Svix
  const headers = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
    'svix-signature': req.headers.get('svix-signature') || '',
  };

  // 4. Validar headers mínimos
  if (!headers['svix-id'] || !headers['svix-timestamp'] || !headers['svix-signature']) {
    return NextResponse.json({ error: 'Faltan headers de verificación' }, { status: 400 });
  }

  // 5. Verificar firma con Svix
  try {
    if (WEBHOOK_SECRET) {
      const wh = new Webhook(WEBHOOK_SECRET);
      wh.verify(payload, headers);
    } else {
      console.warn('[Resend Webhook] Saltando verificación de firma en desarrollo (sin secret).');
    }
  } catch (err) {
    console.error('[Resend Webhook] Firma inválida:', err);
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  }

  // 6. Parsear evento
  let event: any;
  try {
    event = JSON.parse(payload);
  } catch (err) {
    return NextResponse.json({ error: 'Payload no es JSON válido' }, { status: 400 });
  }

  const { type, data } = event;

  console.log(`[Resend Webhook] Recibido evento: ${type}`, data.email_id || data.message_id);

  // 7. Procesar evento email.received (INBOUND)
  if (type === 'email.received') {
    return handleEmailReceived(data);
  }

  // 8. Procesar otros eventos (Metadata update)
  if (['email.delivered', 'email.opened', 'email.bounced'].includes(type)) {
    return handleEmailMetadataUpdate(type, data);
  }

  return NextResponse.json({ received: true });
}

async function handleEmailReceived(data: any) {
  const emailId = data.email_id;
  const fromEmail = data.from;
  const subject = data.subject || '(Sin asunto)';
  const messageId = data.message_id;

  // A. Deduplicación por providerMessageId
  const existing = await prisma.leadEmail.findUnique({
    where: { 
      provider_providerMessageId: { 
        provider: 'resend', 
        providerMessageId: messageId 
      } 
    }
  });

  if (existing) {
    return NextResponse.json({ skipped: true, reason: 'Duplicate' });
  }

  // B. Recuperar contenido completo vía API (Webhook solo trae metadata básica)
  let fullEmail: any;
  try {
    if (!resend) {
      throw new Error('Resend client is not initialized');
    }
    const res = await resend.emails.get(emailId);
    if (!res.data) {
      throw new Error('No se pudo recuperar el contenido del correo');
    }
    fullEmail = res.data;
  } catch (error: any) {
    console.error('[Resend Webhook] Error al recuperar contenido:', error);
    return NextResponse.json({ error: 'Error al recuperar contenido' }, { status: 500 });
  }

  // C. Matching del Lead
  // 1. Por código en Subject: [SJ-XXXXXX]
  let inboundCode = extractInboundCode(subject);
  
  // 2. Por código en To (si es lead-sj-xxxxxx@domain.com)
  if (!inboundCode && data.to) {
    const toStr = Array.isArray(data.to) ? data.to.join(' ') : data.to;
    inboundCode = extractInboundCode(toStr);
  }

  let leadId: string | null = null;

  if (inboundCode) {
    const leadByCode = await prisma.lead.findUnique({
      where: { inboundCode },
      select: { id: true }
    });
    if (leadByCode) leadId = leadByCode.id;
  }

  // 3. Fallback por Email (solo si no hay ambigüedad)
  if (!leadId) {
    const leadsByEmail = await prisma.lead.findMany({
      where: { email: fromEmail },
      orderBy: { createdAt: 'desc' },
      take: 2
    });
    // Solo asociamos si hay exactamente uno o preferimos el más reciente si el código falló
    if (leadsByEmail.length === 1) {
      leadId = leadsByEmail[0].id;
    } else if (leadsByEmail.length > 1) {
      console.warn(`[Resend Webhook] Múltiples leads encontrados para ${fromEmail}. No se pudo asociar automáticamente.`);
    }
  }

  if (!leadId) {
    console.warn(`[Resend Webhook] No se encontró lead para el correo de ${fromEmail}`);
    return NextResponse.json({ skipped: true, reason: 'Lead not found' });
  }

  // D. Sanitización y guardado
  const htmlBody = fullEmail.html ? sanitizeInboundEmailHtml(fullEmail.html) : null;
  const textBody = fullEmail.text || '(Contenido no disponible)';

  try {
    await logEmailRecord({
      leadId,
      direction: 'INBOUND',
      subject,
      bodyText: textBody,
      htmlBody,
      toEmail: Array.isArray(data.to) ? data.to.join(', ') : data.to,
      fromEmail,
      status: 'RECEIVED',
      provider: 'resend',
      providerMessageId: messageId,
      receivedAt: new Date(data.created_at || Date.now())
    });

    await logActivity(leadId, 'Respuesta recibida por correo', 'EMAIL_RECEIVED', textBody.substring(0, 500));

    // E. Actualizar último contacto entrante
    await prisma.lead.update({
      where: { id: leadId },
      data: { lastInboundAt: new Date() }
    });

    // F. Revalidar vistas
    revalidatePath('/admin/owner/leads');
    revalidatePath('/admin/developer/leads');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Resend Webhook] Error al guardar inbound:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleEmailMetadataUpdate(type: string, data: any) {
  const resendId = data.email_id;
  const status = type.split('.')[1].toUpperCase(); // DELIVERED, OPENED, BOUNCED

  try {
    const updateData: any = { status };
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();
    if (status === 'OPENED') updateData.openedAt = new Date();
    if (status === 'BOUNCED') updateData.bouncedAt = new Date();

    await prisma.leadEmail.updateMany({
      where: { resendId },
      data: updateData
    });

    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error('[Resend Webhook] Error al actualizar metadata:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
