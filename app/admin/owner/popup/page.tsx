import { requireOwner } from '@/lib/auth-guards'
import { requireAuthTenant } from '@/lib/tenant'
import { getActivePopup } from '@/lib/actions/popup'
import { redirect } from 'next/navigation'
import { PopupForm } from '@/components/admin/popup-form'

export default async function OwnerPopupPage() {
  await requireOwner()
  const { flags } = await requireAuthTenant()

  if (!flags?.enablePromoPopup) redirect('/admin/owner')

  const popup = await getActivePopup()

  return (
    <div className="max-w-6xl mx-auto pb-8">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Pop-Up Comercial</h2>
        <p className="text-neutral-400 mt-1 text-sm">
          Configura el modal promocional que aparece en el sitio público para captar la atención de tus visitantes.
        </p>
      </div>

      <PopupForm popup={popup} />
    </div>
  )
}
