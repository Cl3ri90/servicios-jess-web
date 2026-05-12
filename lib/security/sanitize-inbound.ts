import sanitizeHtml from "sanitize-html";

/**
 * Sanitiza HTML entrante de correos electrónicos para prevenir XSS.
 * Utiliza sanitize-html que es compatible con entornos serverless sin dependencias de DOM (como jsdom).
 */
export function sanitizeInboundEmailHtml(dirtyHtml?: string | null): string {
  if (!dirtyHtml) return "";

  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "blockquote", "a",
      "h1", "h2", "h3", "h4", "h5", "h6", "div", "span", "img",
      "table", "thead", "tbody", "tr", "th", "td"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["style"] // El estilo inline es común en emails, sanitize-html lo maneja de forma segura por defecto
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" })
    }
  });
}

/**
 * Convierte HTML a texto plano seguro eliminando todas las etiquetas.
 */
export function htmlToSafeText(html?: string | null): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {}
  })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
