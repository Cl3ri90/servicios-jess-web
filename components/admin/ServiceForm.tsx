'use client'

import { useState, useTransition } from 'react'
import { createService, deleteService, updateService } from '@/lib/actions/services'
import { useRouter, usePathname } from 'next/navigation'
import { FileText, X } from 'lucide-react'

export function ServiceForm({ initialData, tenantId }: { initialData?: any, tenantId?: string }) {
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
          ? await updateService(initialData.id, formData)
          : await createService(formData)
          
        if (res.error) setMessage({ type: 'error', text: res.error })
        if (res.success) {
          setMessage({ type: 'success', text: res.success })
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
        {initialData ? 'Editar Servicio Estructural' : 'Crear Nuevo Servicio'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Título del Servicio</label>
           <input type="text" name="title" defaultValue={initialData?.title} required className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Mecanizado CNC"/>
        </div>
         <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">URL Slug (Opcional)</label>
           <input type="text" name="slug" defaultValue={initialData?.slug} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="mecanizado-cnc"/>
        </div>
        <div className="md:col-span-2">
           <label className="flex items-center gap-3 bg-neutral-950 p-4 border border-neutral-800 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
              <input type="checkbox" name="isActive" defaultChecked={initialData ? initialData.isActive : true} className="w-5 h-5 accent-orange-500 rounded bg-neutral-800 border-neutral-700" />
              <span className="font-bold text-white text-sm">Servicio Público Activo (Visible en Front-End)</span>
           </label>
        </div>
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-neutral-400 mb-2">Descripción Corta</label>
           <textarea name="shortDesc" defaultValue={initialData?.shortDesc || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" rows={2}></textarea>
        </div>
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-neutral-400 mb-2">Contenido Extendido HTML</label>
           <textarea name="content" defaultValue={initialData?.content || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none font-mono text-xs" rows={6}></textarea>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Imagen Principal {initialData?.featuredImage && '(Actual adjunta)'}</label>
           <input type="file" name="featuredImage" accept="image/*" className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition" />
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Ficha Técnica en PDF {initialData?.pdfUrl && '(Actual adjunto)'}</label>
           <input type="file" name="pdfDoc" accept="application/pdf" className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-[var(--color-primary)] hover:file:bg-neutral-700 transition" />
        </div>
        <div className="md:col-span-2">
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
        {isPending ? 'Guardando...' : initialData ? 'GUARDAR CAMBIOS' : 'CREAR SERVICIO B2B'}
      </button>
    </form>
  )
}

export function DeleteServiceButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  
  return (
     <button 
       disabled={isPending}
       onClick={() => {
         if (confirm('¿Seguro que deseas eliminar este servicio estructural?')) {
           startTransition(async () => {
             await deleteService(id)
           })
         }
       }}
       className="text-red-500 text-sm font-medium hover:underline disabled:opacity-50"
     >
       {isPending ? 'Eliminando...' : 'Eliminar'}
     </button>
  )
}
