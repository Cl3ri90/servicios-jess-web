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
      metaTitle: config?.metaTitle || 'Servicios Jess',
      metaDescription: config?.metaDescription || 'Maestranza Avanzada y Soluciones B2B.',
      contactEmail: config?.contactEmail || 'contacto@serviciosjess.cl',
      contactPhone: config?.contactPhone || '+56 9 1234 5678',
      devSignature: config?.devSignature || 'Diseñado y Desarrollado por DuetSolutions',
      devSignatureUrl: config?.devSignatureUrl || 'https://duetsolutions.cl',
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
