'use client'

import { useState, useTransition } from 'react'
import { createClient, deleteClient } from '@/lib/actions/clients'

export function ClientForm({ tenantId }: { tenantId?: string }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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
          setMessage({ type: 'success', text: res.success })
          const form = e.target as HTMLFormElement
          form.reset()
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fatal de sistema.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-xl mb-10">
      <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c] mb-6 border-b border-neutral-800 pb-2">Registrar Mandante Corporativo</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Nombre o Razón Social</label>
          <input type="text" name="name" required className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" placeholder="Codelco, BHP, etc..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Orden (#)</label>
          <input type="number" name="order" defaultValue={0} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-400 mb-2">Logo Corporativo (Transparente ideal)</label>
          <input type="file" name="logoUrl" accept="image/*" className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition" />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded border font-bold text-center mt-8 ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <button disabled={isPending} type="submit" className="w-full py-4 bg-[#ea580c] hover:bg-[#c2410a] disabled:opacity-50 transition-colors uppercase font-black tracking-widest text-white mt-8">
        {isPending ? 'Insertando...' : 'Guardar Cliente'}
      </button>
    </form>
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
