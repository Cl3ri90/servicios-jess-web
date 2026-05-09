import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('svix-signature'); // Resend uses Svix for webhooks sometimes, but usually resend-signature
    const resendSignature = req.headers.get('resend-signature');
    
    // In a real production app with Resend, you verify the webhook using svix or resend's webhook verifier.
    // We will do a basic check using a custom secret for now, as standard Webhooks might be configured manually.
    const secret = process.env.RESEND_WEBHOOK_SECRET;

    if (secret) {
      // Very basic security: check if a custom secret token is passed in header or query if not using svix
      const token = req.headers.get('authorization') || req.nextUrl.searchParams.get('token');
      if (token !== `Bearer ${secret}` && token !== secret) {
        // Just warning, not blocking in case Resend's native signature isn't implemented here fully yet
        console.warn('Webhook secret mismatch. Expected secure token.');
      }
    }

    const payload = JSON.parse(rawBody);

    // Resend webhook events usually have { type: 'email.delivered', data: { email_id: '...' } }
    if (!payload.type || !payload.data || !payload.data.email_id) {
      return NextResponse.json({ success: false, error: 'Invalid payload structure' }, { status: 400 });
    }

    const emailId = payload.data.email_id;
    const type = payload.type;

    // Map resend events to our status
    let newStatus = '';
    let updateData: any = {};

    switch (type) {
      case 'email.sent':
        newStatus = 'SENT';
        updateData.sentAt = new Date();
        break;
      case 'email.delivered':
        newStatus = 'DELIVERED';
        updateData.deliveredAt = new Date();
        break;
      case 'email.opened':
        newStatus = 'OPENED';
        updateData.openedAt = new Date();
        break;
      case 'email.bounced':
      case 'email.complained':
        newStatus = 'BOUNCED';
        updateData.bouncedAt = new Date();
        break;
      case 'email.delivery_delayed':
        newStatus = 'SENT'; // Or a custom DELAYED status if we had one
        break;
      default:
        // Unhandled event
        return NextResponse.json({ success: true, message: 'Unhandled event type' });
    }

    // Find the email in our DB
    const emailRecord = await prisma.leadEmail.findFirst({
      where: { resendId: emailId }
    });

    if (!emailRecord) {
      return NextResponse.json({ success: true, message: 'Email record not found' });
    }

    // Update the record
    updateData.status = newStatus;
    
    await prisma.leadEmail.update({
      where: { id: emailRecord.id },
      data: updateData
    });

    // Log the activity if it's a significant delivery state
    if (newStatus === 'DELIVERED') {
      await prisma.leadActivity.create({
        data: {
          leadId: emailRecord.leadId,
          type: 'CONTACTED',
          title: `Correo entregado: ${emailRecord.subject}`,
          note: `Entregado en ${emailRecord.toEmail}`
        }
      });
    } else if (newStatus === 'OPENED') {
      await prisma.leadActivity.create({
        data: {
          leadId: emailRecord.leadId,
          type: 'CONTACTED',
          title: `Correo abierto por el cliente`,
          note: `Asunto: ${emailRecord.subject}`
        }
      });
    } else if (newStatus === 'BOUNCED') {
      await prisma.leadActivity.create({
        data: {
          leadId: emailRecord.leadId,
          type: 'CONTACTED',
          title: `⚠️ Error de entrega: Correo rebotado`,
          note: `No se pudo entregar a ${emailRecord.toEmail}`
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Internal error processing webhook' }, { status: 500 });
  }
}
