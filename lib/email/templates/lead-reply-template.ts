import { plainTextToSafeHtml } from './utils';

const BRAND = {
  orange: "#ea580c",
  background: "#0a0a0a",
  panel: "#171717",
  border: "#2a2a2a",
  text: "#f5f5f5",
  muted: "#a1a1aa",
};

interface CreateLeadReplyHtmlProps {
  name: string;
  subject: string;
  message: string;
  siteUrl?: string;
}

/**
 * Genera la plantilla HTML corporativa para respuestas manuales desde el CRM.
 * Diseño Dark Industrial, compatible con Gmail/Outlook y basado en tablas.
 */
export function createLeadReplyHtml({ name, subject, message, siteUrl = "https://serviciosjess.cl" }: CreateLeadReplyHtmlProps): string {
  const safeMessage = plainTextToSafeHtml(message);
  const previewText = "Servicios Jess respondió a tu solicitud.";

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="only light">
  <meta name="supported-color-schemes" content="only light">
  <title>${subject}</title>
  <style type="text/css">
    /* Reset styles for email clients */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${BRAND.background}; }
    
    /* Responsive styles */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.background}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader text -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${previewText}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${BRAND.background};">
    <tr>
      <td align="center" style="padding: 40px 10px 40px 10px;">
        <!-- Container Table -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width: 640px; background-color: ${BRAND.panel}; border: 1px solid ${BRAND.border}; border-radius: 16px; overflow: hidden; border-top: 4px solid ${BRAND.orange}; shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);">
          
          <!-- Header -->
          <tr>
            <td align="left" style="padding: 30px 40px 20px 40px;">
              <h1 style="margin: 0; color: ${BRAND.orange}; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                Servicios Jess <span style="color: ${BRAND.text}; font-weight: 300; font-size: 16px; display: block; margin-top: 4px;">SpA</span>
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content" align="left" style="padding: 0 40px 40px 40px; color: ${BRAND.text}; font-size: 16px; line-height: 26px;">
              <p style="margin: 0 0 20px 0; font-weight: 600; color: ${BRAND.text};">Hola ${name},</p>
              
              <div style="margin: 0 0 30px 0; color: ${BRAND.muted};">
                ${safeMessage}
              </div>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center" bgcolor="${BRAND.orange}" style="border-radius: 12px;">
                    <a href="${siteUrl}" target="_blank" style="padding: 14px 28px; display: inline-block; font-size: 14px; font-weight: 800; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 12px;">
                      Visitar sitio web
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer/Note -->
          <tr>
            <td align="left" style="padding: 0 40px 40px 40px; border-top: 1px solid ${BRAND.border};">
              <p style="margin: 20px 0 0 0; font-size: 12px; line-height: 18px; color: ${BRAND.muted};">
                Este mensaje corresponde a la solicitud ingresada a través del sitio web de <strong>Servicios Jess</strong>.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 11px; line-height: 16px; color: #52525b;">
                <strong>Servicios Jess SpA</strong><br />
                Fabricantes de gomas industriales, plásticos de ingeniería y soluciones de maestranza.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
