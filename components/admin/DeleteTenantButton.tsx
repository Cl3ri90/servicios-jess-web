'use client'

import { useState, useTransition } from 'react'
import { deleteTenant } from '@/lib/actions/dev-tenant'
import { Trash2, AlertTriangle, X } from 'lucide-react'

export function DeleteTenantButton({ tenantId, tenantSlug, tenantName }: { tenantId: string, tenantSlug: string, tenantName: string }) {
  const [showModal, setShowModal] = useState(false)
  const [confirmationInput, setConfirmationInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const isConfirmed = confirmationInput === tenantSlug || confirmationInput === tenantName

  const handleDelete = () => {
    if (!isConfirmed) return
    setMessage(null)
    startTransition(async () => {
      const result = await deleteTenant(tenantId, confirmationInput)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else if (result.success) {
        setMessage({ type: 'success', text: result.success })
        setTimeout(() => setShowModal(false), 2000)
      }
    })
  }

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className="w-full text-center px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-sm font-bold uppercase rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
        title="Eliminar Tenant Permanentemente"
      >
        <Trash2 className="w-4 h-4" /> Eliminar
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => !isPending && setShowModal(false)}
              disabled={isPending}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Zona de Peligro</h3>
              <p className="text-red-400 font-medium text-sm mt-2">
                Esta acción es irreversible y borrará toda la configuración y datos del inquilino.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-400 mb-2 font-medium">
                Para confirmar, escribe el nombre <strong className="text-white">"{tenantName}"</strong> o el slug <strong className="text-white">"{tenantSlug}"</strong>.
              </p>
              <input 
                type="text" 
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={tenantSlug}
                disabled={isPending}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all font-mono text-sm"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg mb-6 text-sm font-medium text-center ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                disabled={isPending}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={!isConfirmed || isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/30 text-white disabled:text-white/50 font-black py-3 px-4 rounded-lg transition-all"
              >
                {isPending ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
