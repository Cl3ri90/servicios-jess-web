'use client'

import { useState, useTransition } from 'react'
import { createPortfolio, deletePortfolio, updatePortfolio } from '@/lib/actions/portfolio'
import { useRouter, usePathname } from 'next/navigation'
import { X } from 'lucide-react'

export function PortfolioForm({ initialData, tenantId }: { initialData?: any, tenantId?: string }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    if (tenantId) formData.append('developerTenantId', tenantId)
    
    startTransition(async () => {
      try {
        const res = initialData
          ? await updatePortfolio(initialData.id, formData)
          : await createPortfolio(formData)
          
        if (res.error) setMessage({ type: 'error', text: res.error })
        if (res.success) {
          setMessage({ type: 'success', text: res.message! })
          if (!initialData) {
             const form = e.target as HTMLFormElement
             form.reset()
          }
          router.push(pathname)
          router.refresh()
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fatal de sistema.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-xl mb-10 relative">
      {initialData && (
        <button type="button" onClick={() => router.push(pathname)} className="absolute top-4 right-4 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full transition">
          <X className="w-5 h-5" />
        </button>
      )}
      <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c] mb-6 border-b border-neutral-800 pb-2">
        {initialData ? 'Editar Caso de Éxito' : 'Registrar Proyecto Destacado'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Nombre del Proyecto</label>
           <input type="text" name="title" defaultValue={initialData?.title} required className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Construcción Estructura X..."/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Categoría (Opcional)</label>
           <input type="text" name="category" defaultValue={initialData?.category || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Minería / Agroindustria"/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Cliente / Mandante</label>
           <input type="text" name="clientName" defaultValue={initialData?.clientName || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Nombre Corporativo..."/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Industria</label>
           <input type="text" name="industry" defaultValue={initialData?.industry || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Ej. Automotriz..."/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Materialidades</label>
           <input type="text" name="material" defaultValue={initialData?.material || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Ej. Acero Inoxidable, Goma..."/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">URL Slug (Opcional)</label>
           <input type="text" name="slug" defaultValue={initialData?.slug || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="galpon-cliente-x"/>
        </div>
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-neutral-400 mb-2">Especificaciones Técnicas Visibles (HTML o texto claro)</label>
           <textarea name="specs" defaultValue={initialData?.specs || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" rows={4}></textarea>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Fotografía (Vercel Blob) {initialData?.featuredImage && '(Actual adjunta)'}</label>
           <input type="file" name="featuredImage" accept="image/*" className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition" />
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Orden de Visualización (#)</label>
           <input type="number" name="order" defaultValue={initialData?.order || 0} className="w-32 bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none"/>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded border font-bold text-center mt-8 ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <button disabled={isPending} type="submit" className="w-full py-4 bg-[#ea580c] hover:bg-[#c2410a] disabled:opacity-50 transition-colors uppercase font-black tracking-widest text-white mt-8">
        {isPending ? 'Guardando...' : initialData ? 'APLICAR CAMBIOS' : 'PUBLICAR CASO DE ÉXITO'}
      </button>
    </form>
  )
}

export function DeletePortfolioButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  
  return (
     <button 
       disabled={isPending}
       onClick={() => {
         if (confirm('¿Eliminar proyecto del vitrina pública permanentemente?')) {
           startTransition(async () => {
             await deletePortfolio(id)
           })
         }
       }}
       className="text-red-500 text-sm font-medium hover:underline disabled:opacity-50"
     >
       {isPending ? 'Borrando...' : 'Eliminar'}
     </button>
  )
}
