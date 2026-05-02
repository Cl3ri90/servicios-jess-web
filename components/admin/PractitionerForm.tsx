'use client'

import { useRef, useState } from 'react'
import { upsertPractitioner } from '@/lib/actions/box-booking'
import { useFormStatus } from 'react-dom'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0">
      {pending ? 'Guardando...' : (isEdit ? 'Actualizar Profesional' : 'Agregar Profesional')}
    </button>
  )
}

export function PractitionerForm({ initialData, tenantId }: { initialData?: any | null, tenantId?: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function action(formData: FormData) {
    setError(null)
    setSuccess(null)
    if (tenantId) formData.append('developerTenantId', tenantId)
    const res = await upsertPractitioner(formData, initialData?.id)
    if (res?.error) {
      setError(res.error)
    } else if (res?.success) {
      setSuccess(res.success)
      if (!initialData) formRef.current?.reset()
    }
  }

  return (
    <form ref={formRef} action={action} className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mb-8">
       {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4">{error}</div>}
       {success && <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded mb-4">{success}</div>}

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Nombre *</label>
            <input name="name" required defaultValue={initialData?.name} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white" placeholder="Ej: Dr. Juan Pérez" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Especialidad</label>
            <input name="specialty" defaultValue={initialData?.specialty || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white" placeholder="Ej: Ortodoncia" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Email</label>
            <input name="email" type="email" defaultValue={initialData?.email || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white" placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Teléfono</label>
            <input name="phone" defaultValue={initialData?.phone || ''} className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white" placeholder="+56 9..." />
          </div>
       </div>

       <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
         <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={initialData ? initialData.isActive : true} className="w-5 h-5 accent-orange-500" />
            <span className="text-sm text-neutral-300 font-medium">Actor Activo (Puede arrendar)</span>
         </label>
         <SubmitButton isEdit={!!initialData} />
       </div>
    </form>
  )
}
