import { requireOwner } from '@/lib/auth-guards'
import { requireAuthTenant } from '@/lib/tenant'
import { getActivePopup, savePopupConfig } from '@/lib/actions/popup'
import { redirect } from 'next/navigation'
import { PopupForm } from '@/components/admin/popup-form'
export default async function OwnerPopupPage() {
  await requireOwner()
  const { flags } = await requireAuthTenant()

  if (!flags?.enablePromoPopup) redirect('/admin/owner')

  const popup = await getActivePopup()

  async function handleSave(formData: FormData) {
    'use server'
    await savePopupConfig(formData)
  }

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-neutral-500"
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1"

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Popup Promocional</h2>
        <p className="text-neutral-400 mt-1 text-sm">
          En desktop se activa por exit-intent (cursor sale del navegador). En móvil, por delay o scroll.
        </p>
      </div>

      <PopupForm popup={popup} />
    </div>
  )
}
