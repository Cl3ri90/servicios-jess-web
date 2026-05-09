'use client'

import { Lead, LeadActivity } from '@prisma/client'
import { Clock } from 'lucide-react'

type LeadWithActivities = Lead & { activities: LeadActivity[] }

export function CrmTable({ 
  leads, 
  onSelectLead,
  onOpenWonLost
}: { 
  leads: LeadWithActivities[],
  onSelectLead: (id: string) => void,
  onOpenWonLost: (id: string, type: 'WON' | 'LOST') => void
}) {

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-400 min-w-[1000px]">
          <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
            <tr>
              <th className="px-6 py-4 w-40">Ingreso</th>
              <th className="px-6 py-4 w-56">Cliente / Empresa</th>
              <th className="px-6 py-4">Requerimiento</th>
              <th className="px-6 py-4 w-40 text-center">Etapa Pipeline</th>
              <th className="px-6 py-4 w-32 text-center">Score</th>
              <th className="px-6 py-4 w-40 text-center">Seguimiento</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => {
              const now = new Date();
              const isOverdue = lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < now && lead.status !== 'WON' && lead.status !== 'LOST' && lead.status !== 'ARCHIVED';
              
              let priorityClasses = 'text-neutral-500';
              if (lead.priority === 'HIGH') priorityClasses = 'text-[#ea580c] font-bold';
              else if (lead.priority === 'URGENT') priorityClasses = 'text-red-400 font-bold';

              let stageClasses = 'bg-neutral-800 text-neutral-400 border-neutral-700';
              if (lead.pipelineStage === 'CONTACT') stageClasses = 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/20';
              if (lead.pipelineStage === 'QUALIFICATION') stageClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
              if (lead.pipelineStage === 'QUOTATION') stageClasses = 'bg-orange-500/10 text-orange-300 border-orange-500/20';
              if (lead.pipelineStage === 'WON') stageClasses = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
              if (lead.pipelineStage === 'LOST') stageClasses = 'bg-neutral-900 text-neutral-500 border-neutral-800';

              return (
                <tr 
                  key={lead.id} 
                  onClick={() => onSelectLead(lead.id)}
                  className={`border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors align-top cursor-pointer ${lead.status === 'ARCHIVED' ? 'opacity-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="font-mono text-neutral-300">{new Date(lead.createdAt).toLocaleDateString()}</div>
                    <div className="font-mono text-neutral-500 text-[10px] mt-0.5">{new Date(lead.createdAt).toLocaleTimeString()}</div>
                    <div className="mt-3 flex flex-col gap-1 items-start">
                      <span className={`text-[10px] uppercase tracking-widest ${priorityClasses}`}>
                        {lead.priority}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-base truncate max-w-[200px]">
                      {lead.name}
                    </div>
                    {lead.company && (
                      <div className="text-orange-400 text-sm font-medium mt-1 truncate max-w-[200px]">
                        {lead.company}
                      </div>
                    )}
                    <div className="text-xs text-neutral-500 mt-2 truncate max-w-[200px]">
                      {lead.email}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-neutral-300 text-xs line-clamp-3 leading-relaxed">
                      {lead.message}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest border inline-block ${stageClasses}`}>
                      {lead.pipelineStage}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center font-mono font-bold text-neutral-300 bg-neutral-950 border border-neutral-800 px-3 py-1 rounded">
                      {lead.score}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center text-xs">
                    {lead.nextFollowUpAt ? (
                      <div className={`flex flex-col items-center gap-1 ${isOverdue ? 'text-[#ea580c] font-bold' : 'text-neutral-400'}`}>
                        <Clock className="w-4 h-4" />
                        <span>{new Date(lead.nextFollowUpAt).toLocaleDateString()}</span>
                        {isOverdue && <span className="text-[9px] uppercase tracking-widest bg-[#ea580c]/10 px-2 py-0.5 rounded">Vencido</span>}
                      </div>
                    ) : (
                      <span className="text-neutral-600">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="text-neutral-400 font-light text-lg">No hay oportunidades comerciales.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
