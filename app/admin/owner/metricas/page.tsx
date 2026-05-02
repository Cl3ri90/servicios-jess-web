import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import MetricasView from '@/components/admin/views/MetricasView'

export default async function AdminMetricasPage() {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')

  return <MetricasView tenantId={profile.tenantId} />
}
