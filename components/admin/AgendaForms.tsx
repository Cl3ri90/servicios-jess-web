'use client'

import { useRef, useState } from 'react'
import { createBooking, createBlockedSlot, deleteBlockedSlot, updateBookingStatus } from '@/lib/actions/box-booking'
import { useFormStatus } from 'react-dom'

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full mt-4">
      {pending ? 'Procesando...' : label}
    </button>
  )
}

export function AgendaForms({ boxes, practitioners, tenantId }: { boxes: any[], practitioners: any[], tenantId?: string }) {
  const [mode, setMode] = useState<'booking'|'block'|null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleBooking(formData: FormData) {
    setError(null); setSuccess(null)
    if (tenantId) formData.append('developerTenantId', tenantId)
    const res = await createBooking(formData)
    if (res?.error) setError(res.error)
    else if (res?.success) { setSuccess(res.success); formRef.current?.reset(); setMode(null) }
  }

  async function handleBlock(formData: FormData) {
    setError(null); setSuccess(null)
    if (tenantId) formData.append('developerTenantId', tenantId)
    const res = await createBlockedSlot(formData)
    if (res?.error) setError(res.error)
    else if (res?.success) { setSuccess(res.success); formRef.current?.reset(); setMode(null) }
  }

  return (
    <div className="mb-8">
      <div className="flex gap-4 mb-4">
        <button onClick={() => setMode('booking')} className={`px-4 py-2 rounded text-sm font-bold ${mode === 'booking' ? 'bg-orange-500 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>
          + Nueva Reserva
        </button>
        <button onClick={() => setMode('block')} className={`px-4 py-2 rounded text-sm font-bold ${mode === 'block' ? 'bg-red-500 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>
          + Bloquear Horario
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded mb-4">{success}</div>}

      {mode === 'booking' && (
        <form ref={formRef} action={handleBooking} className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg animate-in fade-in slide-in-from-top-2">
          <h3 className="text-lg font-bold text-white mb-4">Registrar Reserva</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Seleccionar Box</label>
              <select name="boxId" required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white">
                <option value="">Seleccione...</option>
                {boxes.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Profesional</label>
              <select name="practitionerId" required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white">
                <option value="">Seleccione...</option>
                {practitioners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Inicio</label>
              <input type="datetime-local" name="startTime" required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Fin</label>
              <input type="datetime-local" name="endTime" required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Precio Total</label>
              <input type="number" step="0.01" name="price" defaultValue={0} min={0} required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Notas Operativas</label>
              <input type="text" name="notes" placeholder="Opcional..." className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white" />
            </div>
          </div>
          <SubmitBtn label="Confirmar Reserva" />
        </form>
      )}

      {mode === 'block' && (
        <form ref={formRef} action={handleBlock} className="bg-neutral-900 border-l-4 border-red-500 border-t border-r border-b border-neutral-800 p-6 rounded-lg animate-in fade-in slide-in-from-top-2">
          <h3 className="text-lg font-bold text-red-400 mb-4">Bloquear Horario (Mantenimiento / Emergencia)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Seleccionar Box</label>
              <select name="boxId" required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white">
                 <option value="">Seleccione...</option>
                 {boxes.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Motivo</label>
              <input type="text" name="reason" placeholder="Ej: Limpieza profunda, Falla técnica..." required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Desde</label>
              <input type="datetime-local" name="startTime" required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-bold mb-2">Hasta</label>
              <input type="datetime-local" name="endTime" required className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white [color-scheme:dark]" />
            </div>
          </div>
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full mt-4">Aplicar Bloqueo Administrativo</button>
        </form>
      )}
    </div>
  )
}

export function BlockManager({ id }: { id: string }) {
  return (
    <button onClick={() => deleteBlockedSlot(id)} className="text-red-400 hover:underline text-xs bg-red-400/10 px-2 py-1 rounded">
      Quitar Bloqueo
    </button>
  )
}

export function BookingManager({ id, status }: { id: string, status: string }) {
  const isCanceledOrCompleted = status === 'CANCELLED' || status === 'COMPLETED'
  if (isCanceledOrCompleted) return <span className="text-neutral-500 text-xs">Cerrada</span>

  return (
     <div className="flex flex-col gap-1 items-end">
       <button onClick={() => updateBookingStatus(id, 'CANCELLED')} className="text-red-400 hover:underline text-xs bg-red-400/10 px-2 py-1 rounded w-full text-center">
         Cancelar Reserva
       </button>
       <button onClick={() => updateBookingStatus(id, 'COMPLETED')} className="text-blue-400 hover:underline text-xs bg-blue-400/10 px-2 py-1 rounded w-full text-center">
         Marcar Completada
       </button>
     </div>
  )
}
