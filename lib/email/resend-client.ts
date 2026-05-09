import 'server-only';
import { Resend } from 'resend';

// IMPORTANT:
// Para producción, RESEND_FROM_EMAIL debe pertenecer a un dominio verificado en Resend.
// Configurar SPF, DKIM y DMARC para mejorar entregabilidad y evitar SPAM.

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn('⚠️ RESEND_API_KEY no está configurado. Los correos no se enviarán, pero el sistema no fallará.');
}

export const resend = apiKey ? new Resend(apiKey) : null;
