import 'server-only';
import type { Lead } from '@prisma/client';

export async function notifyNewLeadCreated(lead: Lead) {
  // FUTURE RESEND INTEGRATION
  // Cuando el dominio esté verificado:
  // 1. instalar resend
  // 2. agregar RESEND_API_KEY en Vercel
  // 3. configurar from con dominio verificado
  // 4. enviar email al correo configurado en SiteConfig.contactEmail
  
  console.log('[EMAIL STUB] Nuevo lead recibido, email omitido temporalmente:', lead.email);
  return { success: true, skipped: true };
}
