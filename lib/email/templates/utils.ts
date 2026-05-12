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
/**
 * Elimina el saludo inicial del cuerpo del mensaje si ya existe un saludo visual en el template.
 * Esto evita que aparezca "Hola Claudio," dos veces seguidas.
 */
export function cleanEmailBodyGreeting(message: string, leadName?: string): string {
  if (!message) return "";

  // Normalizar saltos de línea y dividir
  const lines = message.replace(/\r\n/g, "\n").split("\n");
  
  // Buscar el índice de la primera línea con contenido
  const firstContentIndex = lines.findIndex(line => line.trim().length > 0);
  if (firstContentIndex === -1) return "";

  const firstLine = lines[firstContentIndex].trim();
  const normalizedName = leadName?.trim().toLowerCase();

  // Patrones de saludo comunes
  const greetingRegex = /^(hola|estimad[oa]|estimado\/a|buenos días|buen dia|buen día|buenas tardes|buenas noches)\b/i;

  const isGreeting = greetingRegex.test(firstLine);

  // Verificar si la línea es solo el nombre del lead (con puntuación opcional)
  const isOnlyName =
    normalizedName &&
    firstLine
      .replace(/[,:!.-]/g, "")
      .trim()
      .toLowerCase() === normalizedName;

  // Si detectamos saludo o solo el nombre, eliminamos esa línea
  if (isGreeting || isOnlyName) {
    const remainingLines = [...lines];
    remainingLines.splice(firstContentIndex, 1);
    const cleaned = remainingLines.join("\n").trimStart();
    
    // Si después de limpiar queda vacío, devolvemos el original por seguridad
    return cleaned.length > 0 ? cleaned : message.trimStart();
  }

  return message.trimStart();
}
