import 'server-only';
import { prisma } from '@/lib/prisma';

export type AdminMenuLink = {
  label: string;
  href: string;
  icon: string;
  flagKey?: string;
  developerOnly?: boolean;
  isGlobal?: boolean;
};

const allLinks: AdminMenuLink[] = [
  { label: 'Identidad del Sitio', href: '/admin/owner/config', icon: 'layout', flagKey: 'configuracion_owner' },
  { label: 'Capacidades', href: '/admin/owner/capacidades', icon: 'tools', flagKey: 'capacidades' },
  { label: 'Portafolio', href: '/admin/owner/portafolio', icon: 'briefcase', flagKey: 'portafolio' },
  { label: 'Empresas Trust', href: '/admin/owner/clientes', icon: 'shield', flagKey: 'trust' },
  { label: 'Indicadores KPI', href: '/admin/owner/metricas', icon: 'activity', flagKey: 'indicadores' },
  { label: 'SEO Core', href: '/admin/developer/seo', icon: 'search', developerOnly: true },
  { label: 'Llamada de Acción', href: '/admin/owner/llamada-accion', icon: 'zap', flagKey: 'cta_principal' },
  { label: 'Pop-Up Comercial', href: '/admin/owner/popup', icon: 'message-square', flagKey: 'popup_promocional' },
  { label: 'Bandeja de Leads', href: '/admin/owner/leads', icon: 'inbox' },
];

const devLinks: AdminMenuLink[] = [
  { label: 'Feature Flags', href: '/admin/developer/flags', icon: 'zap', isGlobal: true },
  { label: 'Identidad Empresa', href: '/admin/developer/empresa', icon: 'home', isGlobal: true },
  { label: 'Botón Flotante CTA', href: '/admin/developer/cta-flotante', icon: 'mouse-pointer', isGlobal: true },
];

export async function getDynamicMenu(role: 'DEVELOPER' | 'OWNER') {
  const flags = await prisma.featureFlag.findMany();

  if (role === 'DEVELOPER') {
    const activeDeveloperLinks = allLinks.filter(link => {
      if (!link.flagKey) return true;
      const flag = flags.find((item: { key: string }) => item.key === link.flagKey);
      return flag?.isActive;
    }).map(link => {
      if (link.label === 'Llamada de Acción') {
        return { ...link, href: '/admin/developer/llamada-accion' };
      }
      return link;
    });
    return [...devLinks, ...activeDeveloperLinks];
  }

  // Para Owner:
  return allLinks.filter((link) => {
    if (link.developerOnly || link.isGlobal) return false;
    if (!link.flagKey) return true;
    
    const flag = flags.find((item: { key: string }) => item.key === link.flagKey);
    return flag?.isActive && flag?.ownerVisible;
  });
}

// Retro-compatibility (or drop them if unused, but exporting for safety)
export async function getOwnerMenu() {
  return getDynamicMenu('OWNER');
}

export async function getDeveloperMenu() {
  return getDynamicMenu('DEVELOPER');
}
