import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import PortafolioView from '@/components/admin/views/PortafolioView'

export default async function AdminPortafolioPage(props: { searchParams: Promise<{ editId?: string }> }) {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')
  const searchParams = await props.searchParams

  return <PortafolioView tenantId={profile.tenantId} searchParams={searchParams} baseUrl="/admin/owner/portafolio" />
}
