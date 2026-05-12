'use client'

import { useState, useTransition, useEffect } from 'react'
import { savePopupConfig } from '@/lib/actions/popup'
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn'
import { CommercialPopupClient } from '@/components/site/commercial-popup-client'
import { AlertCircle, Eye, Monitor, Smartphone, RotateCcw } from 'lucide-react'

// Character limits (soft, visual only)
const LIMITS = { title: 60, text: 180, buttonText: 30 } as const

function CharCounter({ value, limit }: { value: string; limit: number }) {
  const len = value.length
  const ratio = len / limit
  const color = ratio >= 1 ? 'text-red-400' : ratio >= 0.85 ? 'text-amber-400' : 'text-zinc-500'
  return <span className={`text-[10px] font-mono tabular-nums ${color}`}>{len}/{limit}</span>
}

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
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [previewKey, setPreviewKey] = useState(0)

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

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder-neutral-500 min-h-[44px]"
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5"

  // Admin debug: visibility warnings
  const warnings: string[] = [];
  if (formState.isActive !== 'true') warnings.push('El motor principal está apagado.');
  if (!formState.title?.trim()) warnings.push('El pop-up no aparecerá porque no tiene título válido.');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(420px,560px)_1fr] gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-0 pb-28 xl:pb-8">
      
      {/* ── Formulario ── */}
      <form id="popup-form" action={handleSubmit} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-6 relative order-1 min-w-0 max-w-full">
        {popup?.id && <input type="hidden" name="_popupId" value={popup.id} />}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> No se mostrará en el sitio público
            </p>
            {warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-400/80 pl-6">• {w}</p>
            ))}
          </div>
        )}

        {/* Bloque 1: Estado */}
        <div className="flex items-center justify-between gap-4 bg-neutral-950/50 border border-neutral-800 rounded-lg p-4">
          <label htmlFor="popup-isActive" className="text-sm font-bold text-white">Estado del popup</label>
          <select 
            id="popup-isActive"
            name="isActive" 
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors min-h-[44px] w-auto cursor-pointer" 
            value={formState.isActive} 
            onChange={handleChange}
          >
            <option value="false">🔴 Desactivado</option>
            <option value="true">🟢 Activo</option>
          </select>
        </div>

        {/* Bloque 2: Contenido principal */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" /> Contenido
          </legend>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="popup-title" className={labelClass}>Título del popup *</label>
              <CharCounter value={formState.title} limit={LIMITS.title} />
            </div>
            <input 
              id="popup-title"
              name="title" 
              required 
              className={inputClass} 
              value={formState.title} 
              onChange={handleChange} 
              placeholder="¡Cotización sin costo para minería!" 
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="popup-text" className={labelClass}>Texto descriptivo</label>
              <CharCounter value={formState.text} limit={LIMITS.text} />
            </div>
            <textarea 
              id="popup-text"
              name="text" 
              className={`${inputClass} resize-none`} 
              rows={4} 
              value={formState.text} 
              onChange={handleChange} 
              placeholder="Describe la oferta, el beneficio o el llamado a la acción..." 
            />
          </div>
        </fieldset>

        {/* Bloque 3: CTA */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" /> Llamada a la acción
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="popup-buttonText" className={labelClass}>Texto del botón</label>
                <CharCounter value={formState.buttonText} limit={LIMITS.buttonText} />
              </div>
              <input 
                id="popup-buttonText"
                name="buttonText" 
                className={inputClass} 
                value={formState.buttonText} 
                onChange={handleChange} 
                placeholder="Ver oferta" 
              />
            </div>
            <div>
              <label htmlFor="popup-url" className={labelClass}>URL del botón</label>
              <input 
                id="popup-url"
                name="url" 
                className={inputClass} 
                value={formState.url} 
                onChange={handleChange} 
                placeholder="/contacto" 
              />
            </div>
          </div>
        </fieldset>

        {/* Bloque 4: Imagen */}
        <div>
          <label htmlFor="popup-imageUrl" className={labelClass}>Imagen de cabecera (URL)</label>
          <input 
            id="popup-imageUrl"
            name="imageUrl" 
            className={inputClass} 
            value={formState.imageUrl} 
            onChange={handleChange} 
            placeholder="https://tu-bucket.supabase.co/storage/..." 
          />
          <p className="text-[10px] text-zinc-600 mt-1.5">Recomendado: imagen landscape 16:9. Se mostrará en la parte superior del popup.</p>
        </div>

        {/* Bloque 5: Comportamiento */}
        <div className="bg-neutral-950/60 border border-neutral-800 rounded-lg p-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-zinc-500" /> Comportamiento automático
          </p>
          <div className="text-xs text-zinc-500 leading-relaxed space-y-1">
            <p><strong className="text-zinc-400">Desktop:</strong> aparece cuando el usuario intenta salir de la página.</p>
            <p><strong className="text-zinc-400">Móvil:</strong> aparece después de unos segundos o al detectar scroll.</p>
            <p className="text-zinc-600 pt-1">El cierre se recuerda durante la sesión para no mostrarlo repetidamente.</p>
          </div>
        </div>

        {/* Desktop save button */}
        <div className="pt-4 border-t border-neutral-800 hidden xl:block">
          <DirtySaveBtn 
            isDirty={isDirty} 
            isSaving={isPending} 
            form="popup-form" 
            label="Guardar Popup" 
            className="w-full"
          />
        </div>
      </form>

      {/* ── Preview Sandbox ── */}
      <div className="order-2 xl:sticky xl:top-24 h-fit min-w-0">
        <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-black">
          {/* Toolbar */}
          <div className="bg-zinc-900/50 p-3 border-b border-zinc-800 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase shrink-0">
              <Eye className="w-3.5 h-3.5" />
              Sandbox
            </span>

            <div className="flex items-center gap-2">
              {/* Desktop/Mobile toggle */}
              <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button 
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    previewMode === 'desktop' 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                  aria-label="Vista desktop"
                  aria-pressed={previewMode === 'desktop'}
                >
                  <Monitor className="w-3 h-3" /> Desktop
                </button>
                <button 
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    previewMode === 'mobile' 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                  aria-label="Vista mobile"
                  aria-pressed={previewMode === 'mobile'}
                >
                  <Smartphone className="w-3 h-3" /> Mobile
                </button>
              </div>

              {/* Replay */}
              <button 
                type="button"
                onClick={() => setPreviewKey(k => k + 1)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white hover:border-zinc-700 transition-all bg-zinc-900/50"
                aria-label="Relanzar animación"
              >
                <RotateCcw className="w-3 h-3" /> Relanzar
              </button>

              {/* Traffic light dots */}
              <div className="flex gap-1.5 ml-1">
                <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex items-center justify-center p-4 sm:p-6 min-h-[400px] xl:min-h-[520px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/60 via-zinc-950 to-black">
            <div 
              className={`relative transition-all duration-300 ease-out ${
                previewMode === 'mobile' ? 'w-full max-w-[360px]' : 'w-full max-w-[520px]'
              }`}
              style={{ minHeight: previewMode === 'mobile' ? 380 : 420 }}
            >
              {formState.isActive === 'true' ? (
                <div key={previewKey} className="pointer-events-none w-full h-full relative" style={{ minHeight: previewMode === 'mobile' ? 380 : 420 }}>
                  <CommercialPopupClient 
                    title={formState.title || 'Título Promocional'}
                    text={formState.text}
                    buttonText={formState.buttonText}
                    url={formState.url}
                    imageUrl={formState.imageUrl}
                    isActive={true}
                    isPreview={true}
                  />
                </div>
              ) : (
                <div className="text-center p-8 border border-neutral-800 border-dashed rounded-lg bg-zinc-900/50 backdrop-blur-sm">
                  <p className="text-neutral-500 text-sm">El popup está desactivado.</p>
                  <p className="text-neutral-600 text-xs mt-1">Actívalo para ver la vista previa.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Save Bar (mobile/tablet only) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 xl:hidden bg-black/80 backdrop-blur-md border-t border-white/10 px-4 py-3 safe-area-bottom">
        <DirtySaveBtn 
          isDirty={isDirty} 
          isSaving={isPending} 
          form="popup-form" 
          label="Guardar Popup" 
          className="w-full"
        />
      </div>
    </div>
  )
}
