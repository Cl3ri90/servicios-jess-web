import { getMainCtaConfig } from '@/lib/site/get-main-cta';
import { MainCtaSection } from './main-cta-section';
import { getModuleFlag } from '@/lib/site/get-module-flag';

export async function PublicMainCtaSection() {
  const flag = await getModuleFlag('cta_principal');
  if (!flag.isActive || !flag.renderPublic) return null;

  const config = await getMainCtaConfig();
  if (!config || !config.isEnabled || !config.showOnHome) return null;

  return <MainCtaSection config={config} />;
}
