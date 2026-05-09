'use client'

import { useState, useTransition } from 'react'
import { updateTrustCarouselSpeed } from '@/lib/actions/config'

export function TrustConfigForm({ currentSpeed }: { currentSpeed: number }) {
  const [speed, setSpeed] = useState(currentSpeed)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    
    startTransition(async () => {
      try {
        const res = await updateTrustCarouselSpeed(speed)
        if (res.error) setMessage({ type: 'error', text: res.error })
        if (res.success) setMessage({ type: 'success', text: res.success })
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fatal de sistema.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl flex flex-col md:flex-row md:items-end gap-6">
      <div className="flex-1">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">Velocidad del Carrusel</h3>
        <p className="text-xs text-neutral-400 mb-4">Define cuántos segundos demora una vuelta completa del carrusel. Menor valor = más rápido. (Recomendado: 30 a 60 segundos)</p>
        
        <div className="flex items-center gap-4">
          <input 
            type="number" 
            min={10} 
            max={120} 
            step={1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32 bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-[#ea580c] outline-none font-mono" 
          />
          <span className="text-sm text-neutral-500 font-mono">Segundos</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 min-w-[200px]">
        {message && (
          <div className={`px-3 py-1.5 rounded border text-xs text-center font-medium ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-500'}`}>
            {message.text}
          </div>
        )}
        <button 
          type="submit" 
          disabled={isPending || speed === currentSpeed}
          className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Guardar Velocidad'}
        </button>
      </div>
    </form>
  )
}
