'use client';

import { usePathname } from 'next/navigation';
import { MainCtaSection } from './main-cta-section';

export function MainCtaWrapper({ config, activeFlags, disableOnHome = false }: { config: any, activeFlags: string[], disableOnHome?: boolean }) {
  const pathname = usePathname();

  if (!activeFlags.includes('cta_principal')) return null;
  if (!config || !config.isEnabled) return null;

  let show = false;

  if (pathname === '/' && config.showOnHome && !disableOnHome) show = true;
  if (pathname.startsWith('/empresa') && config.showOnEmpresa) show = true;
  if (pathname.startsWith('/servicios') && config.showOnServicios) show = true;
  if (pathname.startsWith('/portafolio') && config.showOnPortfolio) show = true;
  if (pathname.startsWith('/contacto') && config.showOnContacto) show = true;

  if (!show) return null;

  return <MainCtaSection config={config} />;
}
