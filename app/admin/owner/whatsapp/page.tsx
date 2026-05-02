import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import { checkOwnerAccess } from '@/lib/admin/permissions'
import WhatsAppView from '@/components/admin/views/WhatsAppView'

export default async function WhatsappDashboard() {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')
  
  await checkOwnerAccess('whatsapp')

  return <WhatsAppView tenantId={profile.tenantId} />
}
