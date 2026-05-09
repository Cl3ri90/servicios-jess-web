'use client'

import { useState, useTransition } from 'react'
import { updatePublicModuleOrder, resetPublicModuleOrder } from '@/lib/actions/module-order'

export function PublicModuleReorder({ initialFlags }: { initialFlags: any[] }) {
  // Solo los que tienen render público, ordenados por publicOrder
  const publicModules = initialFlags
    .filter(f => f.publicVisible)
    .sort((a, b) => a.publicOrder - b.publicOrder)

  const [modules, setModules] = useState(publicModules)
  const [isPending, startTransition] = useTransition()
  const [isResetting, startReset] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newModules = [...modules]
    const temp = newModules[index]
    newModules[index] = newModules[index - 1]
    newModules[index - 1] = temp
    
    // Update orders based on visual position
    newModules.forEach((m, i) => m.publicOrder = (i + 1) * 10)
    setModules(newModules)
  }

  const handleMoveDown = (index: number) => {
    if (index === modules.length - 1) return
    const newModules = [...modules]
    const temp = newModules[index]
    newModules[index] = newModules[index + 1]
    newModules[index + 1] = temp
    
    newModules.forEach((m, i) => m.publicOrder = (i + 1) * 10)
    setModules(newModules)
  }

  const handleSave = () => {
    setMessage(null)
    startTransition(async () => {
      const items = modules.map(m => ({ key: m.key, publicOrder: m.publicOrder }))
      const res = await updatePublicModuleOrder(items)
      if (res.error) setMessage({ type: 'error', text: res.error })
      if (res.success) setMessage({ type: 'success', text: 'Orden público guardado.' })
    })
  }

  const handleReset = () => {
    if (!confirm('¿Restablecer orden por defecto?')) return
    setMessage(null)
    startReset(async () => {
      const res = await resetPublicModuleOrder()
      if (res.error) setMessage({ type: 'error', text: res.error })
      if (res.success) {
        setMessage({ type: 'success', text: 'Orden restablecido. Recarga la página.' })
      }
    })
  }

  if (modules.length === 0) return null

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">Orden Público (Home)</h2>
          <p className="text-sm text-neutral-400 mt-1">Reordena cómo se visualizan las secciones en el Frontend. El Hero siempre está fijo arriba.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset} 
            disabled={isResetting || isPending}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 px-3 rounded transition-colors disabled:opacity-50"
          >
            {isResetting ? 'Restableciendo...' : 'Restablecer Orden'}
          </button>
          <button 
            onClick={handleSave} 
            disabled={isPending || isResetting}
            className="text-xs bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : 'Guardar Orden'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded border text-sm text-center font-bold ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_80px_100px] gap-4 px-4 py-2 bg-neutral-950 border border-neutral-800 rounded text-xs font-bold text-neutral-500 uppercase tracking-widest">
          <div>Módulo</div>
          <div className="text-center">Estado</div>
          <div className="text-right">Mover</div>
        </div>
        
        {modules.map((m, index) => (
          <div key={m.key} className="grid grid-cols-[1fr_80px_100px] gap-4 px-4 py-3 bg-neutral-950/50 border border-neutral-800 rounded items-center">
            <div>
              <p className="font-bold text-white text-sm">{m.name}</p>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">{m.key} • orden: {m.publicOrder}</p>
            </div>
            <div className="text-center">
              {m.isActive ? (
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">ACTIVO</span>
              ) : (
                <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">APAGADO</span>
              )}
            </div>
            <div className="flex justify-end gap-1">
              <button 
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:hover:bg-neutral-800 text-white rounded transition-colors"
                title="Subir"
              >
                ▲
              </button>
              <button 
                onClick={() => handleMoveDown(index)}
                disabled={index === modules.length - 1}
                className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:hover:bg-neutral-800 text-white rounded transition-colors"
                title="Bajar"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
