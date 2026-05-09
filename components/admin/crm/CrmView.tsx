'use client'

import { useState, useMemo } from 'react'
import { Lead, LeadActivity } from '@prisma/client'
import { CrmPipeline } from './CrmPipeline'
import { CrmTable } from './CrmTable'
import { LeadDetailPanel } from './LeadDetailPanel'
import { WonLostDialog } from './WonLostDialog'
import { Search, LayoutGrid, List, Archive, Download } from 'lucide-react'

type LeadWithActivities = Lead & { activities: LeadActivity[] }

export function CrmView({ initialLeads }: { initialLeads: LeadWithActivities[] }) {
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  
  const [wonLostDialog, setWonLostDialog] = useState<{ open: boolean; type: 'WON' | 'LOST'; leadId: string | null }>({
    open: false,
    type: 'WON',
    leadId: null
  })

  // Basic client-side filtering
  const filteredLeads = useMemo(() => {
    return initialLeads.filter(lead => {
      if (!searchQuery) return true;
      const term = searchQuery.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(term) ||
        lead.company?.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.message.toLowerCase().includes(term)
      );
    })
  }, [initialLeads, searchQuery]);

  const selectedLead = useMemo(() => {
    return initialLeads.find(l => l.id === selectedLeadId) || null;
  }, [initialLeads, selectedLeadId]);

  // Derived metrics
  const totalNew = initialLeads.filter(l => l.status === 'NEW').length
  const totalInProgress = initialLeads.filter(l => ['OPEN', 'IN_PROGRESS', 'ATTEMPTED_CONTACT', 'CONTACTED', 'QUALIFIED', 'QUOTED'].includes(l.status)).length
  const totalWon = initialLeads.filter(l => l.status === 'WON').length
  const totalLost = initialLeads.filter(l => l.status === 'LOST').length
  
  const now = new Date();
  const totalOverdue = initialLeads.filter(l => l.nextFollowUpAt && new Date(l.nextFollowUpAt) < now && l.status !== 'WON' && l.status !== 'LOST' && l.status !== 'ARCHIVED').length

  const handleOpenWonLost = (leadId: string, type: 'WON' | 'LOST') => {
    setWonLostDialog({ open: true, type, leadId })
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4 md:px-6">
      
      {/* Header */}
      <div className="mb-8 border-b border-neutral-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">CRM Comercial</h2>
            <p className="text-neutral-400 mt-2">Gestión de oportunidades recibidas desde el sitio público.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode('pipeline')}
              className={`p-2 rounded border transition-colors ${viewMode === 'pipeline' ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-300'}`}
              title="Vista Pipeline"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded border transition-colors ${viewMode === 'table' ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-300'}`}
              title="Vista Tabla"
            >
              <List className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-neutral-800 mx-2"></div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors bg-neutral-900 border border-neutral-800 rounded">
              <Download className="w-4 h-4" /> Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Nuevos</div>
          <div className="text-2xl font-black text-white">{totalNew}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">En Gestión</div>
          <div className="text-2xl font-black text-white">{totalInProgress}</div>
        </div>
        <div className="bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-lg p-4">
          <div className="text-[#ea580c] text-xs font-bold uppercase tracking-widest mb-1">Vencidos</div>
          <div className="text-2xl font-black text-[#ea580c]">{totalOverdue}</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-1">Ganados</div>
          <div className="text-2xl font-black text-emerald-400">{totalWon}</div>
        </div>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-4">
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Perdidos</div>
          <div className="text-2xl font-black text-zinc-400">{totalLost}</div>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, empresa, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#ea580c] transition-colors"
          />
        </div>
        
        {/* Futuro: Más filtros (prioridad, fecha, etc.) */}
      </div>

      {/* Main Content */}
      {viewMode === 'pipeline' ? (
        <CrmPipeline 
          leads={filteredLeads} 
          onSelectLead={setSelectedLeadId} 
          onOpenWonLost={handleOpenWonLost}
        />
      ) : (
        <CrmTable 
          leads={filteredLeads} 
          onSelectLead={setSelectedLeadId} 
          onOpenWonLost={handleOpenWonLost}
        />
      )}

      {/* Modals & Panels */}
      {selectedLead && (
        <LeadDetailPanel 
          lead={selectedLead} 
          onClose={() => setSelectedLeadId(null)} 
          onOpenWonLost={handleOpenWonLost}
        />
      )}

      {wonLostDialog.open && (
        <WonLostDialog 
          isOpen={wonLostDialog.open}
          type={wonLostDialog.type}
          leadId={wonLostDialog.leadId!}
          onClose={() => setWonLostDialog({ open: false, type: 'WON', leadId: null })}
        />
      )}

    </div>
  )
}
