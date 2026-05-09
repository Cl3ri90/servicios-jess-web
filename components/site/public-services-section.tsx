import { getActiveServices } from '@/lib/site/get-services';
import { getSiteConfig } from '@/lib/site/get-site-config';
import { ServicesSection } from './services-section';
import { getModuleFlag } from '@/lib/site/get-module-flag';

export async function PublicServicesSection() {
  const flag = await getModuleFlag('capacidades');
  if (!flag.isActive || !flag.renderPublic) return null;

  const services = await getActiveServices();
  if (!services || services.length === 0) return null;

  const { config } = await getSiteConfig();

  return (
    <ServicesSection 
      services={services} 
      title={config?.capabilitiesTitle || undefined}
      introText={config?.capabilitiesIntroText || undefined}
    />
  );
}
