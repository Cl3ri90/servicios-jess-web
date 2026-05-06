import 'server-only';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const getActiveClients = unstable_cache(
  async () => {
    // 1. Check feature flag
    const flag = await prisma.featureFlag.findUnique({
      where: { key: 'trust' },
    });

    if (!flag || !flag.isActive || !flag.publicVisible) {
      return { clients: [], flag };
    }

    // 2. Fetch clients
    const clients = await prisma.client.findMany({
      orderBy: { order: 'asc' },
    });

    return { clients, flag };
  },
  ['active-clients'],
  {
    revalidate: 60,
    tags: ['clients']
  }
);
