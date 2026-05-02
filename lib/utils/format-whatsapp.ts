/**
 * Recibe cualquier formato de número guardado (ej: +56 9 1234 5678, 56912345678, +56-9-1234-5678)
 * y devuelve el formato puro 56912345678 listo para el link apis de wa.me.
 */
export function formatWhatsAppNumber(phone?: string | null): string | null {
  if (!phone) return null;
  // Remover TODO excepto números
  const clean = phone.replace(/\D/g, '');
  return clean || null;
}
