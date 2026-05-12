/**
 * Escapa caracteres especiales de HTML para evitar inyecciones en correos.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Convierte texto plano a HTML seguro preservando saltos de línea.
 */
export function plainTextToSafeHtml(value: string): string {
  if (!value) return "";
  return escapeHtml(value).replace(/\n/g, "<br />");
}
