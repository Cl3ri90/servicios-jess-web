'use client'

import { useState, useEffect } from 'react'
import type { Lead, LeadActivity } from '@prisma/client'
import { Clock } from 'lucide-react'

type LeadWithActivities = Lead & { activities: LeadActivity[] }

/** 
 * Función de mapeo visual para asegurar coherencia con el pipeline simplificado
 */
function getMappedStageData(stage: string) {
  const s = stage as string;
  if (['NEW', 'INBOX'].includes(s)) {
    return { label: 'Nuevo', style: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
  }
  if (['WON', 'RESOLVED'].includes(s)) {
    return { label: 'Resuelto', style: 'bg-emerald-900/10 text-emerald-400 border-emerald-500/20' };
  }
  if (['LOST', 'ARCHIVED'].includes(s)) {
    return { label: 'Perdido', style: 'bg-neutral-900 text-neutral-500 border-neutral-800' };
  }
  // Fallback: Contactado (Cualquier otro estado como QUALIFICATION, QUOTATION, etc)
  return { label: 'Contactado', style: 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/20' };
}

export function CrmTable({
  leads,
  onSelectLead,
  onOpenWonLost,
}: {
  leads: LeadWithActivities[]
  onSelectLead: (id: string) => void
  onOpenWonLost: (id: string, type: 'WON' | 'LOST') => void
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-400 min-w-[800px]">
          <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
            <tr>
              <th className="px-6 py-4 w-40">Ingreso</th>
              <th className="px-6 py-4 w-56">Cliente / Empresa</th>
              <th className="px-6 py-4">Requerimiento</th>
              <th className="px-6 py-4 w-40 text-center">Etapa</th>
              <th className="px-6 py-4 w-40 text-center">Seguimiento</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const now = new Date()
              const isOverdue =
                lead.nextFollowUpAt &&
                new Date(lead.nextFollowUpAt) < now &&
                lead.status !== 'WON' &&
                lead.status !== 'LOST' &&
                lead.status !== 'ARCHIVED'

              let priorityClasses = 'text-neutral-500'
              if (lead.priority === 'HIGH') priorityClasses = 'text-[#ea580c] font-bold'
              else if (lead.priority === 'URGENT') priorityClasses = 'text-red-400 font-bold'

              const { label: stageLabel, style: stageStyle } = getMappedStageData(lead.pipelineStage)

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead.id)}
                  className={`border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors align-top cursor-pointer ${
                    lead.status === 'ARCHIVED' ? 'opacity-50' : ''
                  }`}
                >
                  {/* Fecha de ingreso + prioridad */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="font-mono text-neutral-300" suppressHydrationWarning>
                      {isMounted ? new Date(lead.createdAt).toLocaleDateString('es-CL') : '...'}
                    </div>
                    <div
                      className="font-mono text-neutral-500 text-[10px] mt-0.5"
                      suppressHydrationWarning
                    >
                      {isMounted ? new Date(lead.createdAt).toLocaleTimeString('es-CL') : '...'}
                    </div>
                    <div className="mt-2">
                      <span className={`text-[10px] uppercase tracking-widest ${priorityClasses}`}>
                        {lead.priority === 'URGENT'
                          ? 'Urgente'
                          : lead.priority === 'HIGH'
                          ? 'Alta'
                          : lead.priority === 'LOW'
                          ? 'Baja'
                          : 'Normal'}
                      </span>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm truncate max-w-[200px]">
                      {lead.name}
                    </div>
                    {lead.company && (
                      <div className="text-orange-400 text-xs font-medium mt-1 truncate max-w-[200px]">
                        {lead.company}
                      </div>
                    )}
                    <div className="text-xs text-neutral-500 mt-1 truncate max-w-[200px]">
                      {lead.email}
                    </div>
                  </td>

                  {/* Mensaje */}
                  <td className="px-6 py-4">
                    <div className="text-neutral-300 text-xs line-clamp-3 leading-relaxed">
                      {lead.message}
                    </div>
                  </td>

                  {/* Etapa pipeline — label claro */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest border inline-block font-bold ${stageStyle}`}
                    >
                      {stageLabel}
                    </span>
                  </td>

                  {/* Seguimiento */}
                  <td className="px-6 py-4 text-center text-xs">
                    {lead.nextFollowUpAt ? (
                      <div
                        className={`flex flex-col items-center gap-1 ${
                          isOverdue ? 'text-[#ea580c] font-bold' : 'text-neutral-400'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span suppressHydrationWarning>
                          {isMounted
                            ? new Date(lead.nextFollowUpAt).toLocaleDateString('es-CL')
                            : '...'}
                        </span>
                        {isOverdue && (
                          <span className="text-[9px] uppercase tracking-widest bg-[#ea580c]/10 px-2 py-0.5 rounded">
                            Vencido
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-600">—</span>
                    )}
                  </td>
                </tr>
              )
            })}

            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="text-neutral-400 font-light text-lg">
                    No hay oportunidades comerciales.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
