import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import { CrmView } from '@/components/admin/crm/CrmView'
import { getLeadsCRM } from '@/lib/actions/contact-leads'

export default async function DeveloperLeadsPage() {
  const profile = await getCurrentProfile()
  if (!profile?.tenantId || profile.role !== 'DEVELOPER') redirect('/unauthorized')

  const leads = await getLeadsCRM({ isArchived: false })

  return <CrmView initialLeads={leads as any} />
}
