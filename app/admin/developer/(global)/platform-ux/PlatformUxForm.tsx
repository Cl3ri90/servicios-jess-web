'use client'

import { useRef, useState } from 'react'
import { upsertPlatformConfig } from '@/lib/actions/dev-platform'

export function PlatformUxForm({ initialData }: { initialData: any }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function action(formData: FormData) {
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    const res = await upsertPlatformConfig(formData)
    if (res?.error) setError(res.error)
    else if (res?.success) setSuccess(res.success)
    
    setIsSubmitting(false)
  }

  return (
    <form ref={formRef} action={action} className="bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
      {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500 text-red-600 dark:text-red-400 text-sm p-4 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-50 dark:bg-duet-green/10 border border-green-200 dark:border-duet-green/30 text-green-700 dark:text-duet-green text-sm p-4 rounded-lg mb-6">{success}</div>}

      <div className="space-y-8">
        {/* BRANDING */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Branding (Defaults)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-2">Título de la Plataforma</label>
              <input name="brandingTitle" defaultValue={initialData?.brandingTitle || ''} className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-duet-primary outline-none transition-all" placeholder="Ej: SJ SaaS" />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-2">URL del Logo Global</label>
              <input name="brandingLogoUrl" defaultValue={initialData?.brandingLogoUrl || ''} className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-duet-primary outline-none transition-all" placeholder="https://..." />
            </div>
          </div>
        </section>

        {/* COLORES */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Paleta de Colores</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Esta paleta se heredará como el Tema del nuevo Tenant en su CSS.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-2">Color Primario</label>
              <div className="flex gap-2">
                 <input type="color" name="colorPrimary" defaultValue={initialData?.colorPrimary || '#1E3A8A'} className="h-12 w-12 rounded cursor-pointer shrink-0" />
                 <input type="text" defaultValue={initialData?.colorPrimary || '#1E3A8A'} className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white font-mono text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-2">Color Secundario</label>
              <div className="flex gap-2">
                 <input type="color" name="colorSecondary" defaultValue={initialData?.colorSecondary || '#64748B'} className="h-12 w-12 rounded cursor-pointer shrink-0" />
                 <input type="text" defaultValue={initialData?.colorSecondary || '#64748B'} className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white font-mono text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-2">Color Acento</label>
              <div className="flex gap-2">
                 <input type="color" name="colorAccent" defaultValue={initialData?.colorAccent || '#EA580C'} className="h-12 w-12 rounded cursor-pointer shrink-0" />
                 <input type="text" defaultValue={initialData?.colorAccent || '#EA580C'} className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white font-mono text-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* TIPOGRAFÍA E INTERFAZ */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Tipografía e Interfaz</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-2">Fuente Principal</label>
              <select name="fontFamily" defaultValue={initialData?.fontFamily || 'Inter'} className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-duet-primary outline-none transition-all">
                <option value="Inter">Inter (Sans-serif)</option>
                <option value="Roboto">Roboto (Sans-serif)</option>
                <option value="Playfair Display">Playfair Display (Serif)</option>
                <option value="Oswald">Oswald (Condensed)</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button disabled={isSubmitting} type="submit" className="bg-duet-primary hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          {isSubmitting ? 'Guardando Global...' : 'Guardar UX Global'}
        </button>
      </div>
    </form>
  )
}
