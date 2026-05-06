'use client'

import { useState, useTransition, useEffect } from 'react'
import { savePopupConfig } from '@/lib/actions/popup'
import { LivePreviewShell } from '@/components/admin/live-preview-shell'
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn'
import { CommercialPopupClient } from '@/components/site/commercial-popup-client'

export function PopupForm({ popup }: { popup: any }) {
  const [isPending, startTransition] = useTransition()
  
  const [formState, setFormState] = useState({
    isActive: popup?.isActive ? 'true' : 'false',
    title: popup?.title || '',
    text: popup?.text || '',
    buttonText: popup?.buttonText || '',
    url: popup?.url || '',
    imageUrl: popup?.imageUrl || '',
  })

  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const dirty = 
      formState.isActive !== (popup?.isActive ? 'true' : 'false') ||
      formState.title !== (popup?.title || '') ||
      formState.text !== (popup?.text || '') ||
      formState.buttonText !== (popup?.buttonText || '') ||
      formState.url !== (popup?.url || '') ||
      formState.imageUrl !== (popup?.imageUrl || '');
    setIsDirty(dirty);
  }, [formState, popup])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await savePopupConfig(formData)
      setIsDirty(false)
    })
  }

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-neutral-500"
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <form id="popup-form" action={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5 relative order-2 lg:order-1">
        {popup?.id && <input type="hidden" name="_popupId" value={popup.id} />}

        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-white">Estado del popup:</label>
          <select name="isActive" className={`${inputClass} w-auto`} value={formState.isActive} onChange={handleChange}>
            <option value="false">🔴 Desactivado</option>
            <option value="true">🟢 Activo</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Título del popup *</label>
          <input name="title" required className={inputClass} value={formState.title} onChange={handleChange} placeholder="¡Cotización sin costo para minería!" />
        </div>

        <div>
          <label className={labelClass}>Texto descriptivo (opcional)</label>
          <textarea name="text" className={inputClass} rows={3} value={formState.text} onChange={handleChange} placeholder="Describe la oferta, el beneficio o el llamado a la acción..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Texto del botón</label>
            <input name="buttonText" className={inputClass} value={formState.buttonText} onChange={handleChange} placeholder="Ver oferta" />
          </div>
          <div>
            <label className={labelClass}>URL del botón</label>
            <input name="url" className={inputClass} value={formState.url} onChange={handleChange} placeholder="/contacto" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Imagen opcional (URL)</label>
          <input name="imageUrl" className={inputClass} value={formState.imageUrl} onChange={handleChange} placeholder="https://..." />
        </div>

        <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4 text-xs text-neutral-400 space-y-1">
          <p className="font-bold text-neutral-300 text-sm">ℹ️ Comportamiento automático</p>
          <p>• <strong className="text-white">Desktop:</strong> Se dispara cuando el cursor sale por la parte superior del navegador (exit-intent).</p>
          <p>• <strong className="text-white">Móvil:</strong> Se dispara después de 3 segundos o cuando el usuario hace scroll al 40% de la página.</p>
        </div>

        <div className="pt-4 border-t border-neutral-800">
          <DirtySaveBtn 
            isDirty={isDirty} 
            isSaving={isPending} 
            form="popup-form" 
            label="Guardar Popup" 
            className="w-full"
          />
        </div>
      </form>

      {/* Sidebar Live Preview */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
        <LivePreviewShell title="Sandbox: Pop-up Comercial" className="mb-0">
          <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black relative w-full h-[550px] overflow-hidden flex flex-col items-center justify-center">
            {formState.isActive === 'true' ? (
              <CommercialPopupClient 
                title={formState.title || 'Título Promocional'}
                text={formState.text}
                buttonText={formState.buttonText}
                url={formState.url}
                imageUrl={formState.imageUrl}
                isActive={true}
                isPreview={true}
              />
            ) : (
              <div className="text-center p-8 border border-neutral-800 border-dashed rounded-lg bg-zinc-900/50 backdrop-blur-sm relative z-10">
                <p className="text-neutral-500 text-sm">El popup está desactivado.</p>
              </div>
            )}
          </div>
        </LivePreviewShell>
      </div>
    </div>
  )
}
