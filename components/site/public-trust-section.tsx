import { getActiveClients } from '@/lib/site/get-clients';
import { getGlobalSettings } from '@/lib/actions/config';
import { TrustSection } from './trust-section';
import { getModuleFlag } from '@/lib/site/get-module-flag';

export async function PublicTrustSection() {
  const flag = await getModuleFlag('trust');
  if (!flag.isActive || !flag.renderPublic) return null;

  const { clients } = await getActiveClients();
  if (!clients || clients.length === 0) return null;

  // @ts-ignore - we get it from getGlobalSettings or fetch directly if it's not typed
  // Wait, getGlobalSettings returns SiteSettings which doesn't have trustCarouselSpeed in DEFAULT_SETTINGS yet.
  // We should probably just query Prisma directly here or update getGlobalSettings.
  // Let's just query Prisma.
  const { prisma } = await import('@/lib/db/prisma');
  const siteConfig = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
  const speed = siteConfig?.trustCarouselSpeed || 35;

  return (
    <div style={{ '--marquee-duration': `${speed}s` } as React.CSSProperties}>
      <TrustSection clients={clients} />
    </div>
  );
}
