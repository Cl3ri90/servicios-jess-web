import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import ClientesView from '@/components/admin/views/ClientesView'

export default async function AdminClientesPage() {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')

  return <ClientesView tenantId={profile.tenantId} />
}
