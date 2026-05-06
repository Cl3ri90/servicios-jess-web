import 'server-only';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const getMainCtaConfig = unstable_cache(
  async () => {
    try {
      const config = await prisma.mainCtaConfig.findUnique({
        where: { id: 'main-cta-config' },
      });
      return config;
    } catch (e) {
      console.error('Error fetching main cta config:', e);
      return null;
    }
  },
  ['main-cta-config'],
  {
    tags: ['main-cta'],
    revalidate: 60,
  }
);
