import { prisma } from '@/lib/db/prisma'
import { LeadActions } from '@/components/admin/LeadActions'

export default async function LeadsView({ tenantId }: { tenantId: string }) {
  const leads = await prisma.lead.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Bandeja de Leads Comerciales</h2>
        <p className="text-neutral-400 mt-2">Solicitudes técnicas recibidas desde el sitio público.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400 min-w-[800px]">
             <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
                <tr>
                  <th className="px-6 py-4 w-40">Ingreso & Origen</th>
                  <th className="px-6 py-4">Cliente / Empresa</th>
                  <th className="px-6 py-4 hidden md:table-cell">Requerimiento</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
             </thead>
             <tbody>
                {leads.map(lead => {
                  
                  // Status badge colors
                  let statusClasses = '';
                  if (lead.status === 'NEW') statusClasses = 'text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/20';
                  else if (lead.status === 'IN_REVIEW') statusClasses = 'text-amber-300 bg-amber-500/10 border-amber-500/20';
                  else if (lead.status === 'CONTACTED') statusClasses = 'text-orange-300 bg-orange-500/10 border-orange-500/20';
                  else if (lead.status === 'CLOSED') statusClasses = 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
                  else if (lead.status === 'ARCHIVED') statusClasses = 'text-zinc-400 bg-zinc-800/40 border-zinc-700';
                  else statusClasses = 'text-zinc-400 bg-zinc-800/40 border-zinc-700';

                  // Priority text colors
                  let priorityClasses = 'text-zinc-500';
                  if (lead.priority === 'HIGH') priorityClasses = 'text-[#ea580c] font-bold';
                  else if (lead.priority === 'NORMAL') priorityClasses = 'text-orange-200/50';

                  return (
                    <tr key={lead.id} className={`border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors align-top ${lead.status === 'ARCHIVED' ? 'opacity-50' : ''}`}>
                       <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <div className="font-mono text-neutral-300">{new Date(lead.createdAt).toLocaleDateString()}</div>
                        <div className="font-mono text-neutral-500 text-[10px] mt-0.5">{new Date(lead.createdAt).toLocaleTimeString()}</div>
                        
                        <div className="mt-3 flex flex-col gap-1 items-start">
                          <span className={`px-2 py-0.5 rounded-sm border text-[9px] uppercase tracking-widest ${statusClasses}`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] uppercase tracking-widest mt-1 ${priorityClasses}`}>
                            PRIORIDAD: {lead.priority}
                          </span>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-neutral-800/50">
                          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Origen:</div>
                          <div className="font-mono text-[10px] text-orange-400/80 truncate max-w-[120px]" title={lead.pageUrl || 'Desconocido'}>
                            {lead.pageUrl || '/'}
                          </div>
                          <div className="font-mono text-[9px] text-neutral-600 truncate max-w-[120px]">
                            {lead.source}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-base">
                          {lead.name}
                        </div>
                        {lead.company && (
                          <div className="text-orange-400 text-sm font-medium mt-1">
                            {lead.company}
                          </div>
                        )}
                        <div className="mt-3 space-y-1">
                          <div className="text-xs text-neutral-300 flex items-center gap-2">
                            <span className="text-neutral-500">Email:</span> {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                              <span className="text-neutral-500">Tel:</span> {lead.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="bg-neutral-950 p-4 rounded text-neutral-300 text-xs whitespace-pre-wrap max-h-40 overflow-y-auto border border-neutral-800 leading-relaxed">
                          {lead.message}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top border-l border-neutral-800/50">
                        <LeadActions 
                          leadId={lead.id} 
                          currentStatus={lead.status}
                          currentPriority={lead.priority}
                          currentNote={lead.internalNote}
                        />
                      </td>
                    </tr>
                  )
                })}
                {leads.length === 0 && (
                  <tr>
                     <td colSpan={4} className="px-6 py-16 text-center">
                       <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-600 mb-4">
                         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                       </div>
                       <p className="text-neutral-400 font-light text-lg">La bandeja está vacía.</p>
                       <p className="text-neutral-500 text-sm mt-1">Aún no hay solicitudes B2B ingresadas al sistema.</p>
                     </td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
