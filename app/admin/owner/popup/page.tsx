import { requireOwner } from '@/lib/auth-guards'
import { requireAuthTenant } from '@/lib/tenant'
import { getActivePopup, savePopupConfig } from '@/lib/actions/popup'
import { redirect } from 'next/navigation'

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

      <form action={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5">
        {popup?.id && <input type="hidden" name="_popupId" value={popup.id} />}

        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-white">Estado del popup:</label>
          <select name="isActive" className={`${inputClass} w-auto`} defaultValue={popup?.isActive ? 'true' : 'false'}>
            <option value="false">🔴 Desactivado</option>
            <option value="true">🟢 Activo</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Título del popup *</label>
          <input name="title" required className={inputClass} defaultValue={popup?.title || ''} placeholder="¡Cotización sin costo para minería!" />
        </div>

        <div>
          <label className={labelClass}>Texto descriptivo (opcional)</label>
          <textarea name="text" className={inputClass} rows={3} defaultValue={popup?.text || ''} placeholder="Describe la oferta, el beneficio o el llamado a la acción..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Texto del botón</label>
            <input name="buttonText" className={inputClass} defaultValue={popup?.buttonText || ''} placeholder="Ver oferta" />
          </div>
          <div>
            <label className={labelClass}>URL del botón</label>
            <input name="url" className={inputClass} defaultValue={popup?.url || ''} placeholder="/contacto" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Imagen opcional (URL)</label>
          <input name="imageUrl" className={inputClass} defaultValue={popup?.imageUrl || ''} placeholder="https://..." />
        </div>

        <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4 text-xs text-neutral-400 space-y-1">
          <p className="font-bold text-neutral-300 text-sm">ℹ️ Comportamiento automático</p>
          <p>• <strong className="text-white">Desktop:</strong> Se dispara cuando el cursor sale por la parte superior del navegador (exit-intent).</p>
          <p>• <strong className="text-white">Móvil:</strong> Se dispara después de 3 segundos o cuando el usuario hace scroll al 40% de la página.</p>
          <p>• Por defecto, solo aparece una vez por sesión. Puedes cambiar este comportamiento en fases futuras.</p>
        </div>

        <button type="submit" className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold py-3 px-8 rounded-lg transition-all uppercase tracking-wider w-full">
          Guardar Popup
        </button>
      </form>
    </div>
  )
}
