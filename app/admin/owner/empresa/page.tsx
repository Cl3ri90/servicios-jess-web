import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import EmpresaView from '@/components/admin/views/EmpresaView'

export default async function AdminCompanyPage() {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')

  return <EmpresaView tenantId={profile.tenantId} />
}
