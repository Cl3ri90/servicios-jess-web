import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import WhatsAppView from '@/components/admin/views/WhatsAppView'

export default async function WhatsappDashboard() {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')
  
  if (!profile?.tenant?.legacyFeatureFlags?.enableWhatsApp) {
    redirect('/admin/owner')
  }

  return <WhatsAppView tenantId={profile.tenantId} />
}
