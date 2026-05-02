import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import ServiciosView from '@/components/admin/views/ServiciosView'

export default async function AdminServiciosPage(props: { searchParams: Promise<{ editId?: string }> }) {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')
  const searchParams = await props.searchParams

  return <ServiciosView tenantId={profile.tenantId} searchParams={searchParams} baseUrl="/admin/owner/servicios" />
}
