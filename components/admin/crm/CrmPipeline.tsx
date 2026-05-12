'use client'

import { Lead, LeadActivity, LeadPipelineStage } from '@prisma/client'
import { updateLeadPipelineStage } from '@/lib/actions/contact-leads'
import { Clock, Building2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'

type LeadWithActivities = Lead & { activities: LeadActivity[] }

/**
 * Mapeo de etapas: DB value → etiqueta visual clara para el Owner
 * Simplificado a: NUEVO, CONTACTADO, RESUELTO, PERDIDO
 */
const STAGES: {
  id: LeadPipelineStage
  title: string
  color: string
  headerColor: string
  accentColor: string
}[] = [
  {
    id: 'INBOX',
    title: 'Nuevo',
    color: 'bg-neutral-900/50 border-neutral-800',
    headerColor: 'bg-zinc-800 border-zinc-700',
    accentColor: 'text-zinc-300',
  },
  {
    id: 'CONTACT',
    title: 'Contactado',
    color: 'bg-[#ea580c]/5 border-[#ea580c]/20',
    headerColor: 'bg-[#ea580c]/10 border-[#ea580c]/20',
    accentColor: 'text-[#ea580c]',
  },
  {
    id: 'WON',
    title: 'Resuelto',
    color: 'bg-emerald-900/10 border-emerald-500/20',
    headerColor: 'bg-emerald-900/20 border-emerald-500/20',
    accentColor: 'text-emerald-400',
  },
  {
    id: 'LOST',
    title: 'Perdido',
    color: 'bg-neutral-900 border-neutral-800',
    headerColor: 'bg-neutral-900 border-neutral-800',
    accentColor: 'text-neutral-500',
  },
]

/**
 * Función de mapeo para asegurar que ningún lead desaparezca
 */
function getLeadsForStage(leads: LeadWithActivities[], stageId: string) {
  return leads.filter((l) => {
    const s = l.pipelineStage as string;
    
    if (stageId === 'INBOX') {
      return s === 'INBOX' || s === 'NEW';
    }
    if (stageId === 'WON') {
      return s === 'WON' || s === 'RESOLVED';
    }
    if (stageId === 'LOST') {
      return s === 'LOST' || s === 'ARCHIVED';
    }
    if (stageId === 'CONTACT') {
      // Todo lo que no sea Nuevo, Resuelto o Perdido cae en Contactado (incluye QUALIFICATION, QUOTATION, etc)
      return !['INBOX', 'NEW', 'WON', 'RESOLVED', 'LOST', 'ARCHIVED'].includes(s);
    }
    return false;
  });
}

// ─────────────────────────────────────────────────────────────────
// Lead Card — usado tanto en desktop como en mobile
// ─────────────────────────────────────────────────────────────────
function LeadCard({
  lead,
  stageIndex,
  isUpdating,
  onSelectLead,
  onMove,
}: {
  lead: LeadWithActivities
  stageIndex: number
  isUpdating: boolean
  onSelectLead: (id: string) => void
  onMove: (lead: LeadWithActivities, dir: 'prev' | 'next') => void
}) {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  const now = new Date()
  const isOverdue =
    lead.nextFollowUpAt &&
    new Date(lead.nextFollowUpAt) < now &&
    lead.pipelineStage !== 'WON' &&
    lead.pipelineStage !== 'LOST'
  const isUrgent = lead.priority === 'URGENT'
  const isHigh = lead.priority === 'HIGH'

  return (
    <div
      className={`group bg-neutral-950 border rounded-lg p-3 cursor-pointer hover:border-neutral-600 transition-colors relative
        ${isUpdating ? 'opacity-50 pointer-events-none' : ''}
        ${isOverdue ? 'border-[#ea580c]/50 bg-[#ea580c]/5' : 'border-neutral-800'}
      `}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return
        onSelectLead(lead.id)
      }}
    >
      {/* Priority badge — sin score */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          {isUrgent ? (
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-widest">
              Urgente
            </span>
          ) : isHigh ? (
            <span className="px-1.5 py-0.5 rounded bg-[#ea580c]/20 text-[#ea580c] text-[9px] font-bold uppercase tracking-widest">
              Alta
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-500 text-[9px] font-bold uppercase tracking-widest">
              Normal
            </span>
          )}
        </div>
        {isOverdue && (
          <span className="text-[9px] font-bold text-[#ea580c] uppercase tracking-widest">
            Vencido
          </span>
        )}
      </div>

      {/* Nombre y empresa */}
      <h4 className="font-bold text-sm text-white mb-1 line-clamp-1">{lead.name}</h4>
      {lead.company && (
        <div className="flex items-center gap-1.5 text-xs text-orange-400/80 mb-2">
          <Building2 className="w-3 h-3 flex-shrink-0" />
          <span className="line-clamp-1">{lead.company}</span>
        </div>
      )}

      {/* Snippet del mensaje */}
      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{lead.message}</p>

      {/* Footer: seguimiento + botones de etapa */}
      <div className="mt-3 pt-2 border-t border-neutral-800/50 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          {lead.nextFollowUpAt ? (
            <div
              className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-[#ea580c] font-bold' : 'text-neutral-500'}`}
              suppressHydrationWarning
            >
              <Clock className="w-3 h-3" />
              {isMounted ? new Date(lead.nextFollowUpAt).toLocaleDateString('es-CL') : '...'}
            </div>
          ) : (
            <div className="text-[10px] text-neutral-600">Sin seguimiento</div>
          )}
        </div>

        {/* Botones mover etapa — siempre visibles en mobile, hover en desktop */}
        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMove(lead, 'prev')
            }}
            disabled={
              stageIndex === 0 ||
              lead.pipelineStage === 'WON' ||
              lead.pipelineStage === 'LOST'
            }
            className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-30 touch-manipulation"
            title="Etapa anterior"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMove(lead, 'next')
            }}
            disabled={
              stageIndex === STAGES.length - 1 ||
              lead.pipelineStage === 'WON' ||
              lead.pipelineStage === 'LOST'
            }
            className="p-1.5 rounded bg-[#ea580c] hover:bg-[#ea580c]/80 text-white disabled:opacity-30 touch-manipulation"
            title="Siguiente etapa"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Mobile Accordion — una etapa por fila, expandible
// ─────────────────────────────────────────────────────────────────
function MobileAccordionStage({
  stage,
  stageIndex,
  stageLeads,
  isUpdating,
  onSelectLead,
  onMove,
}: {
  stage: (typeof STAGES)[0]
  stageIndex: number
  stageLeads: LeadWithActivities[]
  isUpdating: string | null
  onSelectLead: (id: string) => void
  onMove: (lead: LeadWithActivities, dir: 'prev' | 'next') => void
}) {
  // Expandir por defecto si tiene leads
  const [open, setOpen] = useState(stageLeads.length > 0)

  return (
    <div className={`rounded-xl border overflow-hidden ${stage.color}`}>
      {/* Header del accordion */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 border-b ${stage.headerColor} touch-manipulation`}
      >
        <div className="flex items-center gap-3">
          <h3 className={`font-bold text-sm tracking-wide uppercase ${stage.accentColor}`}>
            {stage.title}
          </h3>
          <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded-full text-white/70">
            {stageLeads.length}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-neutral-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        )}
      </button>

      {/* Contenido expandible */}
      {open && (
        <div className="p-3 space-y-3">
          {stageLeads.length === 0 ? (
            <div className="py-4 flex items-center justify-center border border-dashed border-neutral-800 rounded-lg">
              <span className="text-xs text-neutral-600 font-medium uppercase tracking-widest">
                Sin leads
              </span>
            </div>
          ) : (
            stageLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                stageIndex={stageIndex}
                isUpdating={isUpdating === lead.id}
                onSelectLead={onSelectLead}
                onMove={onMove}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// CrmPipeline — componente principal
// ─────────────────────────────────────────────────────────────────
export function CrmPipeline({
  leads,
  onSelectLead,
  onOpenWonLost,
}: {
  leads: LeadWithActivities[]
  onSelectLead: (id: string) => void
  onOpenWonLost: (id: string, type: 'WON' | 'LOST') => void
}) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleMove = async (lead: LeadWithActivities, direction: 'prev' | 'next') => {
    if (isUpdating) return

    const currentStageMappedId = getLeadsForStage([lead], 'INBOX').length > 0 ? 'INBOX' : 
                                 getLeadsForStage([lead], 'WON').length > 0 ? 'WON' :
                                 getLeadsForStage([lead], 'LOST').length > 0 ? 'LOST' : 'CONTACT';

    const currentIndex = STAGES.findIndex((s) => s.id === currentStageMappedId)
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1

    if (newIndex < 0 || newIndex >= STAGES.length) return

    const newStage = STAGES[newIndex].id

    if (newStage === 'WON') {
      onOpenWonLost(lead.id, 'WON')
      return
    }
    if (newStage === 'LOST') {
      onOpenWonLost(lead.id, 'LOST')
      return
    }

    setIsUpdating(lead.id)
    await updateLeadPipelineStage(lead.id, newStage)
    setIsUpdating(null)
  }

  return (
    <>
      {/* ── MOBILE: Accordion vertical ────────────────────────── */}
      <div className="flex flex-col gap-3 lg:hidden">
        {STAGES.map((stage, i) => {
          const stageLeads = getLeadsForStage(leads, stage.id)
          return (
            <MobileAccordionStage
              key={stage.id}
              stage={stage}
              stageIndex={i}
              stageLeads={stageLeads}
              isUpdating={isUpdating}
              onSelectLead={onSelectLead}
              onMove={handleMove}
            />
          )
        })}
      </div>

      {/* ── DESKTOP: Kanban horizontal ──────────────────────────── */}
      <div className="hidden lg:flex gap-4 overflow-x-auto pb-4 items-start min-h-[500px]">
        {STAGES.map((stage, i) => {
          const stageLeads = getLeadsForStage(leads, stage.id)
          return (
            <div
              key={stage.id}
              className={`flex-1 min-w-[260px] max-w-xs flex flex-col rounded-xl border overflow-hidden ${stage.color}`}
            >
              {/* Column header */}
              <div
                className={`px-4 py-3 border-b flex justify-between items-center ${stage.headerColor}`}
              >
                <h3 className={`font-bold text-sm tracking-wide uppercase ${stage.accentColor}`}>
                  {stage.title}
                </h3>
                <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded-full text-white/70">
                  {stageLeads.length}
                </span>
              </div>

              {/* Column content */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar max-h-[calc(100vh-360px)]">
                {stageLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    stageIndex={i}
                    isUpdating={isUpdating === lead.id}
                    onSelectLead={onSelectLead}
                    onMove={handleMove}
                  />
                ))}
                {stageLeads.length === 0 && (
                  <div className="h-20 flex items-center justify-center border border-dashed border-neutral-800 rounded-lg">
                    <span className="text-xs text-neutral-600 font-medium uppercase tracking-widest">
                      Vacío
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
