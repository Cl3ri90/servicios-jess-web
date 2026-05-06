'use client'

import { useState, useTransition, useEffect } from 'react'
import { createClient, deleteClient } from '@/lib/actions/clients'
import { LivePreviewShell } from '@/components/admin/live-preview-shell'
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn'

export function ClientForm({ tenantId }: { tenantId?: string }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [formState, setFormState] = useState({
    name: '',
    order: 0,
    logoUrl: ''
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const dirty = formState.name !== '' || formState.order !== 0 || formState.logoUrl !== '';
    setIsDirty(dirty);
  }, [formState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormState(prev => ({ ...prev, logoUrl: URL.createObjectURL(file) }));
      }
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    if (tenantId) formData.append('developerTenantId', tenantId)

    startTransition(async () => {
      try {
        const res = await createClient(formData)
        if (res.error) setMessage({ type: 'error', text: res.error })
        if (res.success) {
          setMessage({ type: 'success', text: res.message! })
          setIsDirty(false)
          const form = e.target as HTMLFormElement
          form.reset()
          setFormState({ name: '', order: 0, logoUrl: '' })
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fatal de sistema.' })
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-10 relative">
      <form id="client-form" onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-xl relative order-2 lg:order-1">
        <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c] mb-6 border-b border-neutral-800 pb-2">Registrar Mandante Corporativo</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Nombre o Razón Social</label>
            <input type="text" name="name" value={formState.name} onChange={handleChange} required className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Codelco, BHP, etc..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Orden (#)</label>
            <input type="number" name="order" value={formState.order} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Logo Corporativo (Transparente ideal)</label>
            <input type="file" name="logoUrl" accept="image/*" onChange={handleChange} className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition" />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded border font-bold text-center mt-8 ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <div className="pt-8">
          <DirtySaveBtn 
            isDirty={isDirty} 
            isSaving={isPending} 
            form="client-form" 
            label="Guardar Cliente" 
            className="w-full"
          />
        </div>
      </form>

      {/* Sidebar Live Preview */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
        <LivePreviewShell title="Sandbox: Mandante Trust" className="mb-0">
          <div className="bg-[#050505] flex flex-col justify-center min-h-[350px] relative w-full overflow-hidden rounded-b-lg">
            <p className="text-zinc-500 font-semibold text-[10px] text-center tracking-widest uppercase mb-12 z-10 relative">
              Simulación de Carrusel Público
            </p>
            
            <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-10 pr-10">
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <div key={i} className="flex items-center justify-center min-w-[120px] h-10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
                    {formState.logoUrl ? (
                      <img src={formState.logoUrl} alt={formState.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="font-black text-xl tracking-tighter text-zinc-300 whitespace-nowrap">
                        {formState.name || 'EMPRESA'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LivePreviewShell>
      </div>
    </div>
  )
}

export function DeleteClientButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (confirm('¿Remover cliente de la vitrina?')) {
          startTransition(async () => {
            await deleteClient(id)
          })
        }
      }}
      className="text-red-500 text-sm font-medium hover:underline disabled:opacity-50"
    >
      {isPending ? 'Borrando...' : 'Eliminar'}
    </button>
  )
}
