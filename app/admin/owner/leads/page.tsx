import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import LeadsView from '@/components/admin/views/LeadsView'

export default async function AdminLeadsPage() {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')

  return <LeadsView tenantId={profile.tenantId} />
}
