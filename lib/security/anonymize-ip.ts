export function anonymizeIp(ip?: string | null): string | null {
  if (!ip) return null;
  const cleanIp = ip.split(",")[0]?.trim();
  if (!cleanIp) return null;

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(cleanIp)) {
    const parts = cleanIp.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }

  if (cleanIp.includes(":")) {
    const parts = cleanIp.split(":");
    return parts.slice(0, 4).join(":") + "::";
  }

  return null;
}
