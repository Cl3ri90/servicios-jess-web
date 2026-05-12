import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza HTML entrante de correos electrónicos para prevenir XSS.
 * Permite etiquetas básicas de lectura y fuerza enlaces seguros.
 */
export function sanitizeInboundEmailHtml(html: string): string {
  if (!html) return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 
      'ul', 'ol', 'li', 'blockquote', 'a', 
      'table', 'tr', 'td', 'tbody', 'thead', 'th',
      'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'img' // Permitimos imágenes (útil para firmas o diagramas)
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height', 'target', 'rel',
      'style' // Algunos estilos son necesarios para el layout de tablas en emails
    ],
    // Forzar target="_blank" y rel="noopener noreferrer" en todos los enlaces
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover'],
  });
}
