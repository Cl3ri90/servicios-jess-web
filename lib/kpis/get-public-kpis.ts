import 'server-only';
import { prisma } from '@/lib/db/prisma';
import { getModuleFlag } from '@/lib/site/get-module-flag';

export async function getPublicKpis() {
  const flag = await getModuleFlag('indicadores');
  
  if (!flag.isActive || !flag.renderPublic) {
    return { isVisible: false, metrics: [], flag };
  }

  const metrics = await prisma.metric.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  });

  return {
    isVisible: true,
    metrics,
    flag
  };
}
