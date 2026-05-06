'use client';

import { useTransition } from 'react';
import { updateContactLeadStatus, updateContactLeadPriority, updateContactLeadNote, archiveContactLead } from '@/lib/actions/contact-leads';

export function LeadActions({ leadId, currentStatus, currentPriority, currentNote }: { leadId: string, currentStatus: string, currentPriority: string, currentNote: string | null }) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await updateContactLeadStatus(leadId, e.target.value);
    });
  }

  function handlePriorityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await updateContactLeadPriority(leadId, e.target.value);
    });
  }

  function handleArchive() {
    if (!confirm('¿Archivar este lead?')) return;
    startTransition(async () => {
      await archiveContactLead(leadId);
    });
  }

  function handleNoteChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    // Para simplificar, actualizamos onBlur
    startTransition(async () => {
      await updateContactLeadNote(leadId, e.target.value);
    });
  }

  return (
    <div className="flex flex-col gap-2 min-w-[150px]">
      <select 
        value={currentStatus} 
        onChange={handleStatusChange} 
        disabled={isPending}
        className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs p-2 rounded focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-50"
      >
        <option value="NEW">Nuevo</option>
        <option value="IN_REVIEW">En Revisión</option>
        <option value="CONTACTED">Contactado</option>
        <option value="CLOSED">Cerrado</option>
        <option value="ARCHIVED">Archivado</option>
      </select>

      <select 
        value={currentPriority} 
        onChange={handlePriorityChange} 
        disabled={isPending}
        className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs p-2 rounded focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-50"
      >
        <option value="LOW">Baja Prioridad</option>
        <option value="NORMAL">Normal</option>
        <option value="HIGH">Alta Prioridad</option>
      </select>

      <textarea
        defaultValue={currentNote || ''}
        onBlur={handleNoteChange}
        disabled={isPending}
        placeholder="Notas internas..."
        className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs p-2 rounded focus:outline-none focus:border-[var(--color-primary)] min-h-[60px] resize-none mt-2 disabled:opacity-50"
      />

      {currentStatus !== 'ARCHIVED' && (
        <button 
          onClick={handleArchive} 
          disabled={isPending}
          className="mt-2 text-[10px] uppercase font-bold text-neutral-500 hover:text-white transition-colors"
        >
          ARCHIVAR
        </button>
      )}
    </div>
  );
}
