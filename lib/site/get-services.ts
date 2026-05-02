import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getActiveServices() {
  const flags = await prisma.featureFlag.findUnique({
    where: { key: 'capacidades' },
    select: { isActive: true }
  });

  // If the feature flag is off globally, return empty to hide public feature
  if (!flags?.isActive) return [];

  const services = await prisma.serviceCapability.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      description: true,
      imageUrl: true,
      iconName: true,
    }
  });

  return services;
}
