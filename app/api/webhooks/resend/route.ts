import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/email/resend-client';
import { logEmailRecord, logActivity } from '@/lib/email/lead-email-logging';
import { extractInboundCode } from '@/lib/email/inbound-utils';
import { sanitizeInboundEmailHtml } from '@/lib/security/sanitize-inbound';
import { Webhook } from 'svix';
import { revalidatePath } from 'next/cache';

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    // 1. Obtener raw body para verificación de firma (CRÍTICO: usar text(), no json())
    const payload = await req.text();
    
    // 2. Obtener headers de Svix
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    // 3. Validar headers mínimos (Tarea 4: Early Return)
    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: 'Faltan headers de verificación' }, { status: 400 });
    }

    // 4. Verificar existencia de secret en producción
    if (process.env.NODE_ENV === 'production' && !WEBHOOK_SECRET) {
      console.error('[Resend Webhook] Error: RESEND_WEBHOOK_SECRET no configurado.');
      return NextResponse.json({ error: 'Configuración de seguridad faltante' }, { status: 500 });
    }

    // 5. Verificar firma con Svix
    try {
      if (WEBHOOK_SECRET) {
        const wh = new Webhook(WEBHOOK_SECRET);
        wh.verify(payload, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        });
      } else {
        console.warn('[Resend Webhook] Saltando verificación de firma en desarrollo (sin secret).');
      }
    } catch (err) {
      console.error('[Resend Webhook] Firma inválida:', err);
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }

    // 6. Parsear evento (Solo después de validar firma)
    let event: any;
    try {
      event = JSON.parse(payload);
    } catch (err) {
      return NextResponse.json({ error: 'Payload no es JSON válido' }, { status: 400 });
    }

    const { type, data } = event;
    const messageId = data.message_id || data.email_id;

    // 7. Validación de ID de mensaje (Tarea 8)
    if (!messageId && type.startsWith('email.')) {
      console.warn(`[Resend Webhook] Recibido evento ${type} sin message_id ni email_id. Ignorando.`);
      return NextResponse.json({ success: true, ignored: true, reason: 'Missing ID' });
    }

    console.log(`[Resend Webhook] Recibido evento: ${type}`, messageId);

    // 7. Deduplicación temprana (Early Return - Tarea 4)
    if (messageId) {
      const existing = await prisma.leadEmail.findUnique({
        where: { 
          provider_providerMessageId: { 
            provider: 'resend', 
            providerMessageId: messageId 
          } 
        },
        select: { id: true }
      });

      if (existing) {
        return NextResponse.json({ success: true, skipped: true, reason: 'Duplicate' });
      }
    }

    // 8. Procesar evento email.received (INBOUND)
    if (type === 'email.received') {
      return handleEmailReceived(data);
    }

    // 9. Procesar otros eventos (Metadata update)
    if (['email.delivered', 'email.opened', 'email.bounced'].includes(type)) {
      return handleEmailMetadataUpdate(type, data);
    }

    return NextResponse.json({ success: true, ignored: true });

  } catch (error) {
    console.error('[Resend Webhook] Error global no manejado:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleEmailReceived(data: any) {
  const emailId = data.email_id;
  const fromEmail = data.from;
  const subject = data.subject || '(Sin asunto)';
  const messageId = data.message_id || data.email_id;

  // 1. Recuperar contenido completo vía API (Webhook solo trae metadata básica)
  let fullEmail: any;
  try {
    if (!resend) {
      throw new Error('Resend client is not initialized');
    }
    // IMPORTANTE: Para correos recibidos (receiving) se usa este método específico
    const res = await (resend.emails as any).receiving.get(emailId);
    if (!res.data) {
      throw new Error('No se pudo recuperar el contenido del correo recibido');
    }
    fullEmail = res.data;
  } catch (error: any) {
    console.error('[Resend Webhook] Error al recuperar contenido:', error.message || error);
    // Retornamos 200 con error interno para evitar reintentos infinitos si es un error de API
    return NextResponse.json({ success: false, error: 'Error al recuperar contenido de Resend' }, { status: 200 });
  }

  // 2. Matching del Lead
  // A. Por código en Subject: [SJ-XXXXXX]
  let inboundCode = extractInboundCode(subject);
  
  // B. Por código en To (si es lead-sj-xxxxxx@domain.com)
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

  // C. Fallback por Email (solo si no hay ambigüedad)
  if (!leadId && fromEmail) {
    const leadsByEmail = await prisma.lead.findMany({
      where: { email: fromEmail },
      orderBy: { createdAt: 'desc' },
      take: 2
    });
    if (leadsByEmail.length === 1) {
      leadId = leadsByEmail[0].id;
    }
  }

  if (!leadId) {
    console.warn(`[Resend Webhook] No se encontró lead para el correo de ${fromEmail}`);
    return NextResponse.json({ success: true, ignored: true, reason: 'Lead not found' });
  }

  // 3. Sanitización y guardado
  const htmlBody = fullEmail.html ? sanitizeInboundEmailHtml(fullEmail.html) : null;
  const textBody = fullEmail.text || '(Contenido no disponible)';

  try {
    // A. Registrar correo
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

    // B. Registrar actividad
    await logActivity(leadId, 'Respuesta recibida por correo', 'EMAIL_RECEIVED', textBody.substring(0, 500));

    // C. Actualizar lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { lastInboundAt: new Date() }
    });

    // D. Revalidar cache de Next.js
    try {
      revalidatePath('/admin/owner/leads');
      revalidatePath('/admin/developer/leads');
    } catch (e) {
      // Ignorar errores de revalidación en el webhook
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Resend Webhook] Error al guardar inbound:', error);
    return NextResponse.json({ error: 'Error al procesar base de datos' }, { status: 200 });
  }
}

async function handleEmailMetadataUpdate(type: string, data: any) {
  const resendId = data.email_id;
  if (!resendId) {
    return NextResponse.json({ success: true, ignored: true, reason: 'Missing email_id for metadata update' });
  }

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
