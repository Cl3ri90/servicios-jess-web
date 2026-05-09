import { getPublicKpis } from '@/lib/kpis/get-public-kpis';
import { KpiSection } from './kpi-section';

export async function PublicKpiSection() {
  const { isVisible, metrics } = await getPublicKpis();
  
  if (!isVisible || metrics.length === 0) return null;

  return <KpiSection metrics={metrics} />;
}
