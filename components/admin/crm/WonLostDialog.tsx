'use client'

import { useState } from 'react'
import { updateLeadPipelineStage } from '@/lib/actions/contact-leads'
import { X } from 'lucide-react'

export function WonLostDialog({ 
  isOpen, 
  type, 
  leadId, 
  onClose 
}: { 
  isOpen: boolean; 
  type: 'WON' | 'LOST'; 
  leadId: string; 
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false)
  const [estimatedValue, setEstimatedValue] = useState('')
  const [lostReason, setLostReason] = useState('')

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await updateLeadPipelineStage(leadId, type, {
      estimatedValue: type === 'WON' && estimatedValue ? parseInt(estimatedValue, 10) : undefined,
      lostReason: type === 'LOST' && lostReason ? lostReason : undefined
    });
    
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className={`px-6 py-4 border-b flex justify-between items-center ${type === 'WON' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-neutral-950 border-neutral-800'}`}>
          <h3 className={`font-bold uppercase tracking-widest ${type === 'WON' ? 'text-emerald-400' : 'text-neutral-300'}`}>
            Marcar como {type === 'WON' ? 'Ganado' : 'Perdido'}
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {type === 'WON' ? (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Valor Estimado (CLP) <span className="text-neutral-600 text-xs font-normal">(Opcional)</span>
              </label>
              <input 
                type="number" 
                value={estimatedValue}
                onChange={e => setEstimatedValue(e.target.value)}
                placeholder="Ej. 1500000"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Agregar el valor estimado permitirá calcular el retorno comercial generado por la web en el Command Center.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Razón de pérdida
              </label>
              <select 
                value={lostReason}
                onChange={e => setLostReason(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-3 text-white focus:outline-none focus:border-neutral-500 transition-colors"
              >
                <option value="">Seleccione una razón...</option>
                <option value="Sin presupuesto">Sin presupuesto</option>
                <option value="No responde">No responde</option>
                <option value="No corresponde al servicio">No corresponde al servicio</option>
                <option value="Precio no aceptado">Precio no aceptado</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-sm font-bold transition-colors ${
                type === 'WON' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              } disabled:opacity-50`}
            >
              {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
