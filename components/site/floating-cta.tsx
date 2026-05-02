import { getFloatingCTA } from '@/lib/site/get-floating-cta';
import { FloatingCTAClient } from './floating-cta-client';

export async function FloatingCTAWrapper() {
  const config = await getFloatingCTA();
  if (!config) return null;
  
  return <FloatingCTAClient config={config} />;
}
