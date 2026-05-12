import { prisma } from '@/lib/prisma';

/**
 * Genera un código único alfanumérico para el matching de leads inbound.
 * Formato: SJ-XXXXXX
 */
export function generateInboundCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Evitamos I, O, 0, 1 por legibilidad
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SJ-${code}`;
}

/**
 * Asegura que un lead tenga un código inboundCode. 
 * Si no lo tiene, lo genera y lo guarda.
 */
export async function ensureLeadInboundCode(leadId: string): Promise<string> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { inboundCode: true }
  });

  if (lead?.inboundCode) {
    return lead.inboundCode;
  }

  // Generar uno nuevo y guardar
  const newCode = generateInboundCode();
  
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { inboundCode: newCode }
    });
    return newCode;
  } catch (error) {
    // Si hay colisión (poco probable), reintentar una vez
    const retryCode = generateInboundCode();
    await prisma.lead.update({
      where: { id: leadId },
      data: { inboundCode: retryCode }
    });
    return retryCode;
  }
}

/**
 * Asegura que el asunto del correo contenga el código del lead.
 * Evita duplicados si el código ya está presente.
 */
export function ensureSubjectHasLeadCode(subject: string, inboundCode: string): string {
  if (subject.includes(`[${inboundCode}]`)) {
    return subject;
  }
  return `[${inboundCode}] ${subject}`;
}

/**
 * Construye la dirección de Reply-To para capturar respuestas.
 * Si no hay dominio de recepción configurado, retorna null.
 */
export function buildInboundReplyTo(inboundCode: string): string | null {
  const domain = process.env.RESEND_RECEIVING_DOMAIN;
  if (!domain) return null;
  
  // Formato: lead-sj-a1b2c3@tu-dominio.com
  return `lead-${inboundCode.toLowerCase()}@${domain}`;
}

/**
 * Extrae el inboundCode de un string (asunto o destinatario).
 */
export function extractInboundCode(text: string): string | null {
  const match = text.match(/SJ-[A-Z2-9]{6}/i);
  return match ? match[0].toUpperCase() : null;
}
