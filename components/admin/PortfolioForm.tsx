'use client'

import { useState, useTransition, useEffect } from 'react'
import { createPortfolio, deletePortfolio, updatePortfolio } from '@/lib/actions/portfolio'
import { useRouter, usePathname } from 'next/navigation'
import { X } from 'lucide-react'

import { LivePreviewShell } from '@/components/admin/live-preview-shell'
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn'
import { PortfolioCard } from '@/components/site/portfolio-card'
import { RichTextEditor } from '@/components/admin/rich-text-editor'

export function PortfolioForm({ initialData, tenantId }: { initialData?: any, tenantId?: string }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const [formState, setFormState] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    clientName: initialData?.clientName || '',
    publicClientName: initialData?.publicClientName || '',
    industry: initialData?.industry || '',
    pieceType: initialData?.pieceType || '',
    material: initialData?.material || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || initialData?.specs || '',
    richDescription: initialData?.richDescription || '',
    internalNotes: initialData?.internalNotes || '',
    featuredImage: initialData?.coverImageUrl || initialData?.featuredImage || '',
    imageAlt: initialData?.imageAlt || '',
    order: initialData?.sortOrder || initialData?.order || 0,
    isPublished: initialData ? (initialData.isPublished ?? initialData.isActive) : true,
    isFeatured: initialData?.isFeatured || false,
    showClientName: initialData?.showClientName || false,
  })

  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const dirty = 
      formState.title !== (initialData?.title || '') ||
      formState.category !== (initialData?.category || '') ||
      formState.clientName !== (initialData?.clientName || '') ||
      formState.publicClientName !== (initialData?.publicClientName || '') ||
      formState.industry !== (initialData?.industry || '') ||
      formState.pieceType !== (initialData?.pieceType || '') ||
      formState.material !== (initialData?.material || '') ||
      formState.slug !== (initialData?.slug || '') ||
      formState.shortDescription !== (initialData?.shortDescription || initialData?.specs || '') ||
      formState.richDescription !== (initialData?.richDescription || '') ||
      formState.internalNotes !== (initialData?.internalNotes || '') ||
      formState.featuredImage !== (initialData?.coverImageUrl || initialData?.featuredImage || '') ||
      formState.imageAlt !== (initialData?.imageAlt || '') ||
      formState.order !== (initialData?.sortOrder || initialData?.order || 0) ||
      formState.isPublished !== (initialData ? (initialData.isPublished ?? initialData.isActive) : true) ||
      formState.isFeatured !== (initialData?.isFeatured || false) ||
      formState.showClientName !== (initialData?.showClientName || false);
    setIsDirty(dirty);
  }, [formState, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormState(prev => ({ ...prev, featuredImage: URL.createObjectURL(file) }));
      }
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleRichTextChange = (value: string) => {
    setFormState(prev => ({ ...prev, richDescription: value }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    if (tenantId) formData.append('developerTenantId', tenantId)
    
    // Add Rich Text content manually because it's not a standard input
    formData.set('richDescription', formState.richDescription);
    
    startTransition(async () => {
      try {
        const res = initialData
          ? await updatePortfolio(initialData.id, formData)
          : await createPortfolio(formData)
          
        if (res.error) setMessage({ type: 'error', text: res.error })
        if (res.success) {
          setMessage({ type: 'success', text: res.message! })
          setIsDirty(false)
          if (!initialData) {
             const form = e.target as HTMLFormElement
             form.reset()
             setFormState({
               title: '', category: '', clientName: '', publicClientName: '', industry: '', pieceType: '', material: '', slug: '', shortDescription: '', richDescription: '', internalNotes: '', featuredImage: '', imageAlt: '', order: 0, isPublished: true, isFeatured: false, showClientName: false
             })
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-10 relative">
      <form id="portfolio-form" onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-xl relative order-2 lg:order-1 flex flex-col gap-8">
        {initialData && (
          <button type="button" onClick={() => router.push(pathname)} className="absolute top-4 right-4 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full transition z-10">
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div>
          <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c] mb-6 border-b border-neutral-800 pb-2">
            {initialData ? 'Editar Proyecto' : 'Registrar Proyecto Destacado'}
          </h3>
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500">1. Información Pública</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Nombre del Proyecto / Pieza</label>
                <input type="text" name="title" value={formState.title} onChange={handleChange} required className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Construcción Estructura X..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Categoría (Opcional)</label>
                <input type="text" name="category" value={formState.category} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Minería / Agroindustria"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Industria</label>
                <input type="text" name="industry" value={formState.industry} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Ej. Automotriz..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Tipo de Pieza / Solución</label>
                <input type="text" name="pieceType" value={formState.pieceType} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Tolva, Eje, Engranaje..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Materialidad</label>
                <input type="text" name="material" value={formState.material} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Ej. Acero Inoxidable, Goma..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">URL Slug (Opcional)</label>
                <input type="text" name="slug" value={formState.slug} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="galpon-cliente-x"/>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-400 mb-2">Descripción corta (Resumen del trabajo)</label>
                <textarea name="shortDescription" value={formState.shortDescription} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" rows={3} maxLength={220}></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-400 mb-2">Descripción pública autorizada (Texto enriquecido)</label>
                <RichTextEditor value={formState.richDescription} onChange={handleRichTextChange} placeholder="Escribe el detalle técnico del proyecto aquí..." />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800">
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500">2. Privacidad y Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex items-center gap-3 bg-neutral-950/50 p-4 border border-neutral-800 rounded">
                <input type="checkbox" id="showClientName" name="showClientName" checked={formState.showClientName} onChange={handleChange} className="w-5 h-5 accent-[#ea580c]" />
                <label htmlFor="showClientName" className="text-sm font-medium text-white cursor-pointer">Mostrar nombre de cliente en la web pública</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Cliente público opcional <span className="text-xs text-neutral-600 block">Usa este campo solo si cuentas con autorización.</span></label>
                <input type="text" name="publicClientName" value={formState.publicClientName} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Nombre Corporativo..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Nombre real interno (No público)</label>
                <input type="text" name="clientName" value={formState.clientName} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Nombre real del mandante..."/>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-400 mb-2">Notas internas (Solo Admin, nunca públicas)</label>
                <textarea name="internalNotes" value={formState.internalNotes} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" rows={3} placeholder="Detalles de facturación, contactos, problemas en proyecto..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800">
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500">3. Imágenes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-400 mb-2">Fotografía Principal / Portada {initialData?.coverImageUrl && '(Actual adjunta)'}</label>
                <input type="file" name="featuredImage" accept="image/*" onChange={handleChange} className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-400 mb-2">Texto Alternativo (Alt) de Imagen Principal</label>
                <input type="text" name="imageAlt" value={formState.imageAlt} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Descripción de la imagen para SEO y accesibilidad..."/>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800">
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500">4. Publicación</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isPublished" name="isPublished" checked={formState.isPublished} onChange={handleChange} className="w-5 h-5 accent-[#ea580c]" />
                <label htmlFor="isPublished" className="text-sm font-medium text-white cursor-pointer">Publicado</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={formState.isFeatured} onChange={handleChange} className="w-5 h-5 accent-[#ea580c]" />
                <label htmlFor="isFeatured" className="text-sm font-medium text-white cursor-pointer">Destacado</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Orden (#)</label>
                <input type="number" name="sortOrder" value={formState.order} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none"/>
                {/* also pass 'order' for legacy compatibility in action if needed */}
                <input type="hidden" name="order" value={formState.order} />
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded border font-bold text-center mt-4 ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <div className="pt-8">
          <DirtySaveBtn 
            isDirty={isDirty} 
            isSaving={isPending} 
            form="portfolio-form" 
            label={initialData ? 'APLICAR CAMBIOS' : 'PUBLICAR PROYECTO'} 
            className="w-full"
          />
        </div>
      </form>

      {/* Sidebar Live Preview */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
        <LivePreviewShell title="Sandbox: Caso de Éxito" className="mb-0">
          <div className="p-6 bg-zinc-950 flex justify-center min-h-[450px]">
            <PortfolioCard 
              id="preview"
              title={formState.title || 'Nombre del Proyecto'}
              clientName={formState.showClientName ? (formState.publicClientName || formState.clientName) : null}
              category={formState.category}
              specs={formState.shortDescription}
              featuredImage={formState.featuredImage}
            />
          </div>
        </LivePreviewShell>
      </div>
    </div>
  )
}

export function DeletePortfolioButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      <button 
        type="button"
        disabled={isPending}
        onClick={() => setShowModal(true)}
        className="text-red-500 text-sm font-medium hover:underline disabled:opacity-50"
      >
        {isPending ? 'Borrando...' : 'Eliminar'}
      </button>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-red-500">⚠</span> ¿Eliminar proyecto?
            </h3>
            <p className="text-neutral-400 mb-6 text-sm">
              Esta acción eliminará el proyecto del portafolio público. Las imágenes asociadas no se borrarán del almacenamiento por seguridad.
            </p>
            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                disabled={isPending}
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-bold text-neutral-400 hover:text-white transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                type="button"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await deletePortfolio(id)
                    setShowModal(false)
                  })
                }}
                className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-500 text-white rounded transition disabled:opacity-50"
              >
                {isPending ? 'Procesando...' : 'Confirmar eliminación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
