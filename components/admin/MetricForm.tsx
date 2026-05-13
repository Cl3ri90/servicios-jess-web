'use client'

import { useState, useTransition, useEffect } from 'react'
import { createMetric, deleteMetric, updateMetric } from '@/lib/actions/metrics'
import { LivePreviewShell } from '@/components/admin/live-preview-shell'
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn'
import { KpiCard } from '@/components/site/kpi-card'
import { useRouter } from 'next/navigation'

export function MetricForm({ tenantId, initialData }: { tenantId?: string, initialData?: any }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const [formState, setFormState] = useState({
    value: initialData?.value || '',
    label: initialData?.label || '',
    order: initialData?.order || 0,
    description: initialData?.description || ''
  })

  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormState({
        value: initialData.value || '',
        label: initialData.label || '',
        order: initialData.order || 0,
        description: initialData.description || ''
      })
    }
  }, [initialData])

  useEffect(() => {
    const dirty = initialData 
      ? formState.value !== initialData.value || formState.label !== initialData.label || formState.order !== initialData.order || formState.description !== initialData.description
      : formState.value !== '' || formState.label !== '' || formState.order !== 0 || formState.description !== '';
    setIsDirty(dirty);
  }, [formState, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  }

  const handleCancel = () => {
    router.push('?', { scroll: false })
    if (!initialData) {
      setFormState({ value: '', label: '', order: 0, description: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    if (tenantId) formData.append('developerTenantId', tenantId)
    
    startTransition(async () => {
      try {
        const res = initialData 
          ? await updateMetric(initialData.id, formData)
          : await createMetric(formData)

        if (res.error) setMessage({ type: 'error', text: res.error })
        if (res.success) {
          setMessage({ type: 'success', text: res.message! })
          setIsDirty(false)
          
          if (!initialData) {
            const form = e.target as HTMLFormElement
            form.reset()
            setFormState({ value: '', label: '', order: 0, description: '' })
          } else {
             // If editing, we might want to stay or go back. The revalidatePath will update the list.
             // Clearing the edit param will reset the form via the parent component's key or prop change.
             router.push('?', { scroll: false })
          }
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fatal de sistema.' })
      }
    })
  }

  const isEditing = !!initialData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-10 relative">
      <form id="metric-form" onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-xl relative order-2 lg:order-1">
        <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c] mb-6 border-b border-neutral-800 pb-2">
          {isEditing ? 'Editar Métrica' : 'Crear Métrica'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label className="block text-sm font-medium text-neutral-400 mb-2">Valor (ej. 15+, 350+)</label>
             <input type="text" name="value" value={formState.value} onChange={handleChange} required className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="15+"/>
          </div>
          <div>
             <label className="block text-sm font-medium text-neutral-400 mb-2">Etiqueta (ej. Años de Experiencia)</label>
             <input type="text" name="label" value={formState.label} onChange={handleChange} required className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Proyectos Entregados"/>
          </div>
          <div>
             <label className="block text-sm font-medium text-neutral-400 mb-2">Orden secuencial (#)</label>
             <input type="number" name="order" value={formState.order} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" />
          </div>
          <div>
             <label className="block text-sm font-medium text-neutral-400 mb-2">Descripción (Opcional)</label>
             <input type="text" name="description" value={formState.description} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded border font-bold text-center mt-8 ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <div className="pt-8 flex flex-col md:flex-row gap-4">
          <DirtySaveBtn 
            isDirty={isDirty} 
            isSaving={isPending} 
            form="metric-form" 
            label={isEditing ? "Actualizar KPI" : "Guardar KPI"} 
            className="flex-1"
          />
          {(isEditing || isDirty) && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors rounded font-bold text-sm uppercase tracking-widest"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Sidebar Live Preview */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
        <LivePreviewShell title="Sandbox: Métrica Individual" className="mb-0">
          <div className="p-6 bg-zinc-950 flex flex-col justify-center min-h-[350px]">
            <p className="text-zinc-400 font-semibold text-[10px] text-center tracking-widest uppercase mb-8">
              Componente de Métrica
            </p>
            <div className="mx-auto w-full max-w-[280px]">
              <KpiCard 
                value={formState.value || '0+'}
                label={formState.label || 'Etiqueta del KPI'}
                description={formState.description}
              />
            </div>
          </div>
        </LivePreviewShell>
      </div>
    </div>
  )
}

export function DeleteMetricButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  
  return (
     <button 
       disabled={isPending}
       onClick={() => {
         if (confirm('¿Remover métrica permanente?')) {
           startTransition(async () => {
             await deleteMetric(id)
           })
         }
       }}
       className="text-red-500 text-sm font-medium hover:underline disabled:opacity-50"
     >
       {isPending ? 'Borrando...' : 'Eliminar'}
     </button>
  )
}
