import { prisma } from '@/lib/prisma';

/**
 * En una arquitectura Single-Tenant, el tenantId es siempre 'single'.
 * Este helper existe para mantener compatibilidad con módulos que heredan de una lógica SaaS.
 */
export async function getActiveTenantId() {
  return "single";
}

export async function requireAuthTenant() {
  const allFlags = await prisma.featureFlag.findMany();
  
  // Base keys from DB
  const flagsObj: Record<string, boolean> = {};
  allFlags.forEach((flag: any) => {
    flagsObj[flag.key] = flag.isActive;
  });

  // SaaS Compatibility mapping
  const compatibilityMap: Record<string, string> = {
    'seo_manager': 'enableSeoManager',
    'popup_promocional': 'enablePromoPopup',
    'cta_flotante': 'enableStickyCTA',
    'portafolio': 'enablePortfolio',
    'capacidades': 'enableCapabilities',
    'trust': 'enableTrust',
    'indicadores': 'enableMetrics'
  };

  Object.entries(compatibilityMap).forEach(([dbKey, saasKey]) => {
    if (flagsObj[dbKey] !== undefined) {
      flagsObj[saasKey] = flagsObj[dbKey];
    }
  });

  return {
    tenantId: "single",
    flags: flagsObj,
  };
}
