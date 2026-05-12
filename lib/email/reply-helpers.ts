/**
 * reply-helpers.ts
 * Utilidades para limpieza de respuestas inbound y manejo de asuntos con hilo.
 */

/**
 * Patrones que marcan el inicio del contenido citado en una respuesta de correo.
 * Se buscan en orden: la primera coincidencia corta el cuerpo ahí.
 */
const QUOTE_SEPARATORS = [
  // Fechas en español (respuestas de Gmail, Outlook en español)
  /^El (lun|mar|mié|jue|vie|sáb|dom)[,\s]/im,
  /^El (lun|mar|mié|jue|vie|sáb|dom)\./im,
  // Fechas en inglés
  /^On (Mon|Tue|Wed|Thu|Fri|Sat|Sun)[,\s]/im,
  /^On \d{1,2} /im,
  // Líneas "escribió:" / "wrote:"
  /escribió:\s*$/im,
  /wrote:\s*$/im,
  // Identificadores de Servicios Jess
  /Servicios Jess (escribió|SpA)/im,
  // Cabeceras de forward/reply
  /^From:\s/im,
  /^De:\s/im,
  /^Enviado:\s/im,
  /^Sent:\s/im,
  /^Para:\s/im,
  /^To:\s/im,
  /^Asunto:\s/im,
  /^Subject:\s/im,
  // Separadores estándar
  /^-{3,}\s*Original Message\s*-{3,}/im,
  /^-{3,}\s*Mensaje original\s*-{3,}/im,
  /^_{3,}/im,
  // Bloque de cita de Gmail (>)
  /^>{1,}\s/m,
];

/**
 * Limpia el cuerpo de una respuesta inbound del cliente,
 * extrayendo solo el mensaje nuevo (sin contenido citado).
 *
 * @returns { clean: string, quoted: string | null }
 * - clean: solo el mensaje nuevo del cliente
 * - quoted: el resto del contenido (hilo previo), o null si no hay
 */
export function cleanInboundReplyBody(body: string): {
  clean: string;
  quoted: string | null;
} {
  if (!body) return { clean: '', quoted: null };

  // Normalizar saltos de línea
  const normalized = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  let cutIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const pattern of QUOTE_SEPARATORS) {
      if (pattern.test(line)) {
        cutIndex = i;
        break;
      }
    }

    if (cutIndex !== -1) break;
  }

  if (cutIndex === -1) {
    // No se encontró separador → mostrar todo como "clean"
    return {
      clean: normalized.trim(),
      quoted: null,
    };
  }

  // El mensaje limpio: líneas antes del separador
  const clean = lines
    .slice(0, cutIndex)
    .join('\n')
    .trim();

  // El contenido citado: desde el separador en adelante
  const quoted = lines
    .slice(cutIndex)
    .join('\n')
    .trim();

  return {
    clean: clean || normalized.trim(),
    quoted: quoted || null,
  };
}

/**
 * Asegura que el asunto de una respuesta mantenga el hilo correctamente.
 *
 * Reglas:
 * - Si el asunto ya contiene [SJ-CODE], no añadir otro.
 * - Si no empieza con "Re:", añadir "Re: " al inicio.
 * - No generar "Re: Re: ..." duplicados.
 * - No generar "[SJ-CODE] [SJ-CODE] ..." duplicados.
 *
 * @example
 * ensureThreadedReplySubject("Re: [SJ-RU87AC] DeMO3", "SJ-RU87AC")
 * → "Re: [SJ-RU87AC] DeMO3"   ← sin cambios
 *
 * ensureThreadedReplySubject("[SJ-RU87AC] DeMO3", "SJ-RU87AC")
 * → "Re: [SJ-RU87AC] DeMO3"   ← añade Re:
 *
 * ensureThreadedReplySubject("DeMO3", "SJ-RU87AC")
 * → "Re: [SJ-RU87AC] DeMO3"   ← añade Re: y [SJ-CODE]
 */
export function ensureThreadedReplySubject(
  subject: string,
  inboundCode: string
): string {
  let result = subject.trim();

  // 1. Asegurar que tiene el código del lead (sin duplicar)
  if (!result.includes(`[${inboundCode}]`)) {
    result = `[${inboundCode}] ${result}`;
  }

  // 2. Asegurar que empieza con "Re:" (sin duplicar)
  if (!/^Re:\s/i.test(result)) {
    result = `Re: ${result}`;
  }

  // 3. Limpiar "Re: Re: ..." duplicados que puedan haber quedado
  result = result.replace(/^(Re:\s)+/i, 'Re: ');

  return result;
}
