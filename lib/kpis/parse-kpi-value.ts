export function parseKpiValue(raw: string) {
  const cleanStr = raw.trim();
  // Remove thousand separators like dots or commas before parsing to number, but be careful with decimals.
  // We'll assume KPIs are mostly integers or strings.
  const match = cleanStr.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
  
  if (!match) {
    return { prefix: '', num: null, suffix: cleanStr };
  }

  const numStr = match[2];
  const num = parseInt(numStr, 10);
  
  if (isNaN(num)) {
    return { prefix: '', num: null, suffix: cleanStr };
  }

  return {
    prefix: match[1],
    num,
    suffix: match[3],
  };
}
