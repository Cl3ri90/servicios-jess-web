import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import LeadsView from '@/components/admin/views/LeadsView'

export default async function DeveloperLeadsPage() {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId || profile.role !== 'DEVELOPER') redirect('/unauthorized')

  return <LeadsView tenantId={profile.tenantId} />
}
