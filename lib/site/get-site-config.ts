import 'server-only';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const getSiteConfig = unstable_cache(
  async () => {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 'singleton' },
    });

    // We fetch global flags needed for Navbar/Footer visibility here to optimize DB queries
    // Usually these wouldn't change rapidly and can be part of the global cache
    const flags = await prisma.featureFlag.findMany({
      where: { isActive: true, publicVisible: true },
      select: { key: true }
    });
    const fallbackConfig = {
      ...config,
      name: config?.name || 'Servicios Jess',
      metaTitle: config?.metaTitle || 'Servicios Jess | Gomas industriales, plásticos de ingeniería y maestranza',
      metaDescription: config?.metaDescription || 'Expertos en gomas industriales, plásticos de ingeniería y maestranza. Fabricamos soluciones técnicas a medida para empresas e industrias.',
      contactEmail: config?.contactEmail || 'contacto@serviciosjess.cl',
      contactPhone: config?.contactPhone || '+56 9 1234 5678',
      devSignature: config?.devSignature || 'Diseñado y Desarrollado por DuetSolutions',
      devSignatureUrl: config?.devSignatureUrl || 'https://duetsolutions.cl',
      footerText: config?.footerText || 'Fabricantes de gomas industriales, plásticos de ingeniería y maestranza.',
      capabilitiesTitle: config?.capabilitiesTitle || 'Capacidades Técnicas',
      capabilitiesIntroText: config?.capabilitiesIntroText || 'Infraestructura tecnológica y experiencia humana para fabricar componentes, estructuras y soluciones metalmecánicas críticas.',
    };

    return {
      config: fallbackConfig,
      activeFlags: flags.map((f: { key: string }) => f.key)
    };
  },
  ['site-config-global'],
  {
    revalidate: 60, // Refresh every 60 seconds at most
    tags: ['site-config'] // Can be revalidated via revalidateTag('site-config')
  }
);
