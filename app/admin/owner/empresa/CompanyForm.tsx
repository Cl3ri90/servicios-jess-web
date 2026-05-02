'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { upsertCompanyInfo } from '@/lib/actions/company'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export function CompanyForm({ initialData, tenantId }: { initialData: any, tenantId?: string }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{success?: string; error?: string} | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)
    const formData = new FormData(e.currentTarget)
    if (tenantId) formData.append('developerTenantId', tenantId)

    startTransition(async () => {
      const result = await upsertCompanyInfo(formData)
      if (result.error) setStatus({ error: result.error })
      else setStatus({ success: result.message! })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl space-y-6">
      {status?.success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          {status.success}
        </div>
      )}
      {status?.error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {status.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-semibold text-neutral-300">Título de la Sección</label>
          <input required name="title" defaultValue={initialData?.title || 'Nuestra Empresa'} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors" />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-semibold text-neutral-300">Descripción Larga</label>
          <textarea required name="description" rows={5} defaultValue={initialData?.description || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none" />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-semibold text-neutral-300">Características / Valores (Opcional - Formato de texto simple, separadas por salto de línea o en JSON)</label>
          <textarea name="features" rows={3} defaultValue={initialData?.features || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none" placeholder="1. Calidad superior&#10;2. Entregas a tiempo" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-300">URL de Imagen Decorativa</label>
          <input name="imageUrl" defaultValue={initialData?.imageUrl || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="https://..." />
        </div>

        <div className="space-y-2 flex items-center gap-3 pt-6">
          <input type="checkbox" id="showOnHome" name="showOnHome" defaultChecked={initialData?.showOnHome ?? true} className="w-5 h-5 accent-orange-600 bg-neutral-900 border-neutral-700" />
          <label htmlFor="showOnHome" className="text-sm font-semibold text-neutral-300">Mostrar extracto en página de Inicio</label>
        </div>
      </div>

      <button disabled={isPending} type="submit" className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded transition-colors shadow-lg">
        {isPending ? 'Guardando...' : 'Aplicar Cambios'}
      </button>
    </form>
  )
}
