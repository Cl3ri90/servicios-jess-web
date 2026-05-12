'use client'

import { Lead, LeadActivity, LeadPipelineStage } from '@prisma/client'
import { updateLeadPipelineStage } from '@/lib/actions/contact-leads'
import { Clock, Phone, Mail, Building2, ChevronRight, ChevronLeft, Calendar, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

type LeadWithActivities = Lead & { activities: LeadActivity[] }

const STAGES: { id: LeadPipelineStage, title: string, color: string }[] = [
  { id: 'INBOX', title: 'Nuevos', color: 'bg-zinc-800 border-zinc-700' },
  { id: 'CONTACT', title: 'Contacto', color: 'bg-[#ea580c]/10 border-[#ea580c]/20' },
  { id: 'QUALIFICATION', title: 'Calificación', color: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'QUOTATION', title: 'Cotización', color: 'bg-orange-500/10 border-orange-500/20' },
  { id: 'WON', title: 'Ganado', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  { id: 'LOST', title: 'Perdido', color: 'bg-neutral-900 border-neutral-800 text-neutral-500' }
]

export function CrmPipeline({ 
  leads, 
  onSelectLead,
  onOpenWonLost
}: { 
  leads: LeadWithActivities[],
  onSelectLead: (id: string) => void,
  onOpenWonLost: (id: string, type: 'WON' | 'LOST') => void
}) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleMove = async (lead: LeadWithActivities, direction: 'prev' | 'next') => {
    if (isUpdating) return;
    
    const currentIndex = STAGES.findIndex(s => s.id === lead.pipelineStage);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex < 0 || newIndex >= STAGES.length) return;
    
    const newStage = STAGES[newIndex].id;

    if (newStage === 'WON') {
      onOpenWonLost(lead.id, 'WON');
      return;
    }
    if (newStage === 'LOST') {
      onOpenWonLost(lead.id, 'LOST');
      return;
    }

    setIsUpdating(lead.id);
    await updateLeadPipelineStage(lead.id, newStage);
    setIsUpdating(null);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4 items-start h-[calc(100vh-320px)] min-h-[500px]">
      {STAGES.map((stage, i) => {
        const stageLeads = leads.filter(l => l.pipelineStage === stage.id);
        
        return (
          <div key={stage.id} className={`flex-1 min-w-[280px] lg:min-w-[300px] w-full max-w-sm flex flex-col bg-neutral-900/50 rounded-xl border border-neutral-800/80 overflow-hidden`}>
            {/* Column Header */}
            <div className={`px-4 py-3 border-b flex justify-between items-center ${stage.color}`}>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white/90">{stage.title}</h3>
              <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded-full text-white/70">
                {stageLeads.length}
              </span>
            </div>
            
            {/* Column Content */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {stageLeads.map(lead => {
                const now = new Date();
                const isOverdue = lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < now && stage.id !== 'WON' && stage.id !== 'LOST';
                const isUrgent = lead.priority === 'URGENT';
                const isHigh = lead.priority === 'HIGH';

                return (
                  <div 
                    key={lead.id} 
                    className={`group bg-neutral-950 border rounded-lg p-3 cursor-pointer hover:border-neutral-600 transition-colors relative
                      ${isUpdating === lead.id ? 'opacity-50 pointer-events-none' : ''}
                      ${isOverdue ? 'border-[#ea580c]/50 bg-[#ea580c]/5' : 'border-neutral-800'}
                    `}
                    onClick={(e) => {
                      // Prevent click if clicking buttons
                      if ((e.target as HTMLElement).closest('button')) return;
                      onSelectLead(lead.id)
                    }}
                  >
                    {/* Top Row: Priority & Score */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 items-center">
                        {isUrgent ? (
                          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-widest">Urgente</span>
                        ) : isHigh ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#ea580c]/20 text-[#ea580c] text-[9px] font-bold uppercase tracking-widest">Alta</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[9px] font-bold uppercase tracking-widest">Normal</span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono font-bold bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400" title="Lead Score">
                        {lead.score} pts
                      </div>
                    </div>

                    {/* Main Info */}
                    <h4 className="font-bold text-sm text-white mb-1 line-clamp-1">{lead.name}</h4>
                    {lead.company && (
                      <div className="flex items-center gap-1.5 text-xs text-orange-400/80 mb-2">
                        <Building2 className="w-3 h-3" />
                        <span className="line-clamp-1">{lead.company}</span>
                      </div>
                    )}
                    
                    {/* Message Snippet */}
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-2 leading-relaxed">
                      {lead.message}
                    </p>

                    {/* Footer indicators */}
                    <div className="mt-4 pt-3 border-t border-neutral-800/50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {lead.nextFollowUpAt ? (
                          <div className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-[#ea580c] font-bold' : 'text-neutral-500'}`} title="Seguimiento" suppressHydrationWarning>
                            <Clock className="w-3 h-3" />
                            {isMounted ? new Date(lead.nextFollowUpAt).toLocaleDateString() : '...'}
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-600">Sin seguimiento</div>
                        )}
                      </div>

                      {/* Movement Buttons */}
                      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMove(lead, 'prev'); }}
                          disabled={i === 0 || stage.id === 'WON' || stage.id === 'LOST'}
                          className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-30"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMove(lead, 'next'); }}
                          disabled={i === STAGES.length - 1 || stage.id === 'WON' || stage.id === 'LOST'}
                          className="p-1 rounded bg-[#ea580c] hover:bg-[#ea580c]/80 text-white disabled:opacity-30"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {stageLeads.length === 0 && (
                <div className="h-24 flex items-center justify-center border border-dashed border-neutral-800 rounded-lg">
                  <span className="text-xs text-neutral-600 font-medium uppercase tracking-widest">Vacío</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
