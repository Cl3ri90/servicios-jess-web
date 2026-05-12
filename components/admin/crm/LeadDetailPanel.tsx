'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Lead, LeadActivity, LeadEmail } from '@prisma/client'
import { getLeadById, updateLeadNote, setLeadFollowUp, archiveLead, updateLeadPriority } from '@/lib/actions/contact-leads'
import { sendLeadManualReply } from '@/lib/email/lead-emails'
import { cleanInboundReplyBody, ensureThreadedReplySubject } from '@/lib/email/reply-helpers'
import { X, Building2, Mail, Phone, Clock, Calendar, AlertCircle, FileText, Activity, Trash2, Link, Send, Reply, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'

type LeadWithActivitiesAndEmails = Lead & { activities: LeadActivity[], emails: LeadEmail[] }

const emailStatusStyles: Record<string, string> = {
  PENDING: "bg-zinc-800/40 text-zinc-400 border-zinc-700",
  SENT: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  OPENED: "bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/20",
  BOUNCED: "bg-red-500/10 text-red-300 border-red-500/20",
  FAILED: "bg-red-500/10 text-red-300 border-red-500/20",
  RECEIVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const fallbackEmailStatusStyle = "bg-zinc-800/40 text-zinc-400 border-zinc-700";

export function LeadDetailPanel({ 
  lead: initialLead, 
  onClose,
  onOpenWonLost
}: { 
  lead: Lead; 
  onClose: () => void;
  onOpenWonLost: (id: string, type: 'WON' | 'LOST') => void;
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lead, setLead] = useState<LeadWithActivitiesAndEmails | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [followUpDate, setFollowUpDate] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  // Reply Form State
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [replyError, setReplyError] = useState('')
  const [replyContext, setReplyContext] = useState<string | null>(null) // email subject context

  const [activeTab, setActiveTab] = useState<'info' | 'reply' | 'emails'>('info')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchLeadData = async () => {
    const data = await getLeadById(initialLead.id);
    if (data) {
      setLead(data as LeadWithActivitiesAndEmails);
      setNote(data.internalNote || '');
      if (data.nextFollowUpAt) {
        setFollowUpDate(new Date(data.nextFollowUpAt).toISOString().split('T')[0]);
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchLeadData().finally(() => setLoading(false));
  }, [initialLead.id]);

  const handleRefresh = () => {
    startTransition(async () => {
      await fetchLeadData();
      router.refresh();
    })
  }

  const handleSaveNote = async () => {
    if (!lead || savingNote) return;
    setSavingNote(true);
    await updateLeadNote(lead.id, note);
    const newActivity = { id: Date.now().toString(), leadId: lead.id, type: 'NOTE_ADDED' as const, title: 'Nota interna actualizada', note: note, createdAt: new Date(), createdBy: null };
    setLead({ ...lead, internalNote: note, activities: [newActivity, ...lead.activities] })
    setSavingNote(false);
  }

  const handleSaveFollowUp = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!lead) return;
    const newDate = e.target.value;
    setFollowUpDate(newDate);
    const dateObj = newDate ? new Date(newDate) : null;
    await setLeadFollowUp(lead.id, dateObj);
    getLeadById(lead.id).then(data => { if (data) setLead(data as LeadWithActivitiesAndEmails) });
  }

  const handlePriorityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!lead) return;
    const val = e.target.value as any;
    await updateLeadPriority(lead.id, val);
    getLeadById(lead.id).then(data => { if (data) setLead(data as LeadWithActivitiesAndEmails) });
  }

  const handleArchive = async () => {
    if (!lead) return;
    if (confirm("¿Estás seguro de archivar esta oportunidad? No aparecerá en las vistas principales.")) {
      await archiveLead(lead.id);
      onClose();
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !replySubject.trim() || !replyBody.trim()) return;

    setSendingReply(true);
    setReplyError('');

    const res = await sendLeadManualReply({
      leadId: lead.id,
      subject: replySubject,
      body: replyBody
    });

    if (res.success) {
      setReplySubject('');
      setReplyBody('');
      setActiveTab('emails'); // Switch to emails tab to see it
      getLeadById(lead.id).then(data => { if (data) setLead(data as LeadWithActivitiesAndEmails) });
    } else {
      setReplyError(res.error || 'Ocurrió un error al enviar el correo.');
    }
    
    setSendingReply(false);
  }

  const applyTemplate = (subject: string, body: string) => {
    setReplySubject(subject);
    setReplyBody(body.replace('{name}', lead?.name || 'Cliente'));
  }

  const handleReplyToInbound = (email: LeadEmail) => {
    const inboundCode = (lead as any)?.inboundCode || '';
    const threadedSubject = inboundCode
      ? ensureThreadedReplySubject(email.subject || '', inboundCode)
      : `Re: ${email.subject || ''}`;
    setReplySubject(threadedSubject);
    setReplyBody(`Hola ${lead?.name || 'Cliente'},\n\n`);
    setReplyContext(email.subject || '');
    setActiveTab('reply');
  }

  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] bg-neutral-950 border-l border-neutral-800 shadow-2xl flex items-center justify-center animate-in slide-in-from-right duration-300">
        <div className="animate-spin w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!lead) return null;

  const now = new Date();
  const isOverdue = lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < now && lead.status !== 'WON' && lead.status !== 'LOST' && lead.status !== 'ARCHIVED';

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 border-b border-neutral-800 p-6 flex justify-between items-start bg-neutral-900/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border
                ${lead.status === 'WON' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  lead.status === 'LOST' ? 'bg-neutral-800 text-neutral-500 border-neutral-700' :
                  'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/20'
                }
              `}>
                {lead.status === 'WON' ? 'RESUELTO' : lead.status === 'LOST' ? 'PERDIDO' : 'CONTACTO'}
              </span>
              {isOverdue && (
                <span className="bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Vencido
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white">{lead.name}</h2>
            {lead.company && (
              <div className="flex items-center gap-2 text-orange-400 mt-1 font-medium">
                <Building2 className="w-4 h-4" /> {lead.company}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              disabled={isPending}
              className="p-2 text-neutral-500 hover:text-white transition-colors bg-neutral-900 rounded-lg disabled:opacity-30"
              title="Actualizar este lead"
            >
              <RefreshCw className={`w-5 h-5 ${isPending ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white transition-colors bg-neutral-900 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/30">
          <button 
            onClick={() => setActiveTab('info')} 
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-[#ea580c] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            Información
          </button>
          <button 
            onClick={() => setActiveTab('reply')} 
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reply' ? 'border-[#ea580c] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            Responder
          </button>
          <button 
            onClick={() => setActiveTab('emails')} 
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'emails' ? 'border-[#ea580c] text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            Correos ({lead.emails?.length || 0})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-4">
          
          {/* TAB: INFO */}
          {activeTab === 'info' && (
            <>
              <div className="p-6 border-b border-neutral-800/50 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Email</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Mail className="w-4 h-4 text-neutral-500" />
                      <a href={`mailto:${lead.email}`} className="hover:text-orange-400 transition-colors break-all">{lead.email}</a>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Teléfono</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Phone className="w-4 h-4 text-neutral-500" />
                      {lead.phone ? <a href={`tel:${lead.phone}`} className="hover:text-orange-400 transition-colors">{lead.phone}</a> : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Fecha Ingreso</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span suppressHydrationWarning>{isMounted ? new Date(lead.createdAt).toLocaleDateString() : '...'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Origen / URL</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-300 truncate" title={lead.pageUrl || lead.source}>
                      <Link className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      <span className="truncate">{lead.pageUrl || lead.source}</span>
                    </div>
                  </div>
                </div>

                {lead.estimatedValue && (
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg mt-4">
                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Valor Estimado ({lead.currency})</div>
                    <div className="text-xl font-bold text-emerald-400">
                      ${lead.estimatedValue.toLocaleString('es-CL')}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-b border-neutral-800/50">
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-3">
                  <FileText className="w-4 h-4" /> Requerimiento Original
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {lead.message}
                </div>
              </div>

              <div className="p-6 border-b border-neutral-800/50 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-900/20">
                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-2">
                    Prioridad
                  </label>
                  <select 
                    value={lead.priority} 
                    onChange={handlePriorityChange}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="LOW">Baja</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-2">
                    Próximo Seguimiento
                  </label>
                  <input 
                    type="date" 
                    value={followUpDate}
                    onChange={handleSaveFollowUp}
                    className={`w-full bg-neutral-900 border rounded p-2 text-sm focus:outline-none transition-colors
                      ${isOverdue ? 'border-[#ea580c] text-[#ea580c]' : 'border-neutral-700 text-white focus:border-[#ea580c]'}
                    `}
                  />
                </div>
              </div>

              <div className="p-6 border-b border-neutral-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Notas Internas</div>
                  <button 
                    onClick={handleSaveNote}
                    disabled={savingNote || note === lead.internalNote}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                  >
                    {savingNote ? 'Guardando...' : 'Guardar Nota'}
                  </button>
                </div>
                <textarea 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Escribe notas sobre llamadas, cotizaciones, etc..."
                  className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#ea580c] resize-none transition-colors"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-6">
                  <Activity className="w-4 h-4" /> Historial de Actividad
                </div>
                
                <div className="space-y-3">
                  {lead.activities.map((activity) => (
                    <div key={activity.id} className="bg-neutral-900 p-4 rounded-lg border border-neutral-800">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-white text-xs">{activity.title}</div>
                        <div className="text-[10px] text-neutral-500 font-mono" suppressHydrationWarning>
                          {isMounted ? new Date(activity.createdAt).toLocaleDateString('es-CL') : '...'}
                        </div>
                      </div>
                      {activity.note && (
                        <div className="text-xs text-neutral-400 mt-2 bg-neutral-950/50 p-2 rounded line-clamp-3">
                          {activity.note}
                        </div>
                      )}
                    </div>
                  ))}
                  {lead.activities.length === 0 && (
                    <div className="text-sm text-neutral-600 italic text-center py-4">No hay actividad registrada.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB: REPLY */}
          {activeTab === 'reply' && (
            <div className="p-4 md:p-6">
              {/* Reply context indicator */}
              {replyContext && (
                <div className="mb-4 bg-[#ea580c]/5 border border-[#ea580c]/20 rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-[#ea580c]">
                    <Reply className="w-3 h-3 inline mr-1" />
                    Respondiendo a: <span className="font-medium text-white">{replyContext}</span>
                  </span>
                  <button onClick={() => { setReplyContext(null); setReplySubject(''); setReplyBody(''); }} className="text-neutral-500 hover:text-white text-xs ml-2">✕</button>
                </div>
              )}

              {/* Quick templates — flex-wrap for mobile */}
              <div className="mb-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => applyTemplate('Solicitud recibida', 'Hola {name},\n\nHemos recibido tu solicitud. Nuestro equipo técnico la está revisando y nos pondremos en contacto contigo pronto.')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Solicitud recibida</button>
                <button type="button" onClick={() => applyTemplate('Más antecedentes', 'Hola {name},\n\nPara poder entregar una cotización precisa, ¿podrías facilitarnos los planos o mayor información técnica de tu requerimiento?')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Más antecedentes</button>
                <button type="button" onClick={() => applyTemplate('Coordinar contacto', 'Hola {name},\n\nNos gustaría coordinar una breve llamada para entender mejor tu proyecto. ¿Qué día y horario te acomoda?')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Coordinar contacto</button>
                <button type="button" onClick={() => applyTemplate('Información técnica requerida', 'Hola {name},\n\nGracias por tu contacto. Para poder revisar correctamente tu requerimiento, ¿nos podrías enviar más información técnica, medidas, material requerido o fotografías de referencia?\n\nQuedamos atentos para orientarte de mejor manera.')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Info técnica</button>
                <button type="button" onClick={() => applyTemplate('Planos o medidas de referencia', 'Hola {name},\n\nPara avanzar con la revisión de tu solicitud, agradeceremos que nos puedas compartir planos, medidas aproximadas o fotografías de la pieza/requerimiento.\n\nCon esa información podremos evaluar mejor la factibilidad técnica.')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Planos / medidas</button>
                <button type="button" onClick={() => applyTemplate('Solicitud en revisión', 'Hola {name},\n\nHemos recibido tu información y la dejaremos en revisión técnica. Te contactaremos a la brevedad con comentarios o próximos pasos.\n\nSaludos.')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">En revisión</button>
                <button type="button" onClick={() => applyTemplate('Coordinar revisión técnica', 'Hola {name},\n\nPara entender mejor el requerimiento, podemos coordinar una llamada o revisión técnica. ¿Qué día y horario te acomoda?')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Visita / llamada</button>
                <button type="button" onClick={() => applyTemplate('Seguimiento de solicitud', 'Hola {name},\n\nTe escribimos para dar seguimiento a tu solicitud. Si aún necesitas apoyo con este requerimiento, quedamos atentos a tus comentarios para continuar.')} className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Cierre / seguimiento</button>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Para:</label>
                  <input type="text" value={lead.email} readOnly className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-neutral-400 focus:outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Asunto:</label>
                  <input type="text" required value={replySubject} onChange={e => setReplySubject(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#ea580c] transition-colors" placeholder="Asunto del correo" />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Mensaje:</label>
                  <textarea required value={replyBody} onChange={e => setReplyBody(e.target.value)} className="w-full h-40 md:h-48 bg-neutral-950 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#ea580c] resize-none transition-colors" placeholder="Escribe tu respuesta aquí..." />
                </div>

                {replyError && (
                  <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">
                    {replyError}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={sendingReply || lead.status === 'ARCHIVED'} className="flex items-center gap-2 px-6 py-2.5 bg-[#ea580c] hover:bg-[#ea580c]/80 text-white font-bold rounded transition-colors disabled:opacity-50 touch-manipulation">
                    {sendingReply ? 'Enviando...' : <><Send className="w-4 h-4" /> Enviar Respuesta</>}
                  </button>
                </div>
                {lead.status === 'ARCHIVED' && <p className="text-xs text-neutral-500 text-right mt-2">No puedes enviar correos a un lead archivado.</p>}
              </form>
            </div>
          )}

          {/* TAB: EMAILS */}
          {activeTab === 'emails' && (
            <div className="p-4 md:p-6">
              {lead.emails && lead.emails.length > 0 ? (
                <div className="space-y-4">
                  {lead.emails.map(email => {
                    const isInbound = email.direction === 'INBOUND';
                    const isInternal = email.direction === 'INTERNAL';
                    const rawBody = email.body?.replace(/<[^>]*>?/gm, '') || '';
                    const { clean: cleanBody, quoted: quotedBody } = isInbound
                      ? cleanInboundReplyBody(rawBody)
                      : { clean: rawBody, quoted: null };

                    return (
                      <EmailCard
                        key={email.id}
                        email={email}
                        isInbound={isInbound}
                        isInternal={isInternal}
                        cleanBody={cleanBody}
                        quotedBody={quotedBody}
                        isMounted={isMounted}
                        onReply={() => handleReplyToInbound(email)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <Mail className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No hay correos registrados para este lead.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t border-neutral-800 p-4 bg-neutral-900/80 flex items-center justify-between gap-3">
          <button 
            onClick={handleArchive}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Archivar
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={() => { onOpenWonLost(lead.id, 'LOST'); onClose(); }}
              disabled={lead.status === 'LOST'}
              className="px-4 py-2 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors disabled:opacity-30"
            >
              Marcar Perdido
            </button>
            <button 
              onClick={() => { onOpenWonLost(lead.id, 'WON'); onClose(); }}
              disabled={lead.status === 'WON'}
              className="px-4 py-2 text-sm font-medium bg-emerald-900 hover:bg-emerald-800 text-emerald-100 rounded border border-emerald-700/50 transition-colors disabled:opacity-30"
            >
              Marcar Resuelto
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

function EmailCard({ 
  email, 
  isInbound, 
  isInternal, 
  cleanBody, 
  quotedBody, 
  isMounted, 
  onReply 
}: { 
  email: LeadEmail, 
  isInbound: boolean, 
  isInternal: boolean, 
  cleanBody: string, 
  quotedBody: string | null, 
  isMounted: boolean, 
  onReply: () => void 
}) {
  const [showQuoted, setShowQuoted] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {isInbound ? (
              <span className="text-[10px] font-bold bg-[#ea580c]/20 text-[#ea580c] px-2 py-0.5 rounded border border-[#ea580c]/30 uppercase tracking-widest">Respuesta del Cliente</span>
            ) : isInternal ? (
              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">Interno</span>
            ) : (
              <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700 uppercase tracking-widest">Enviado al Cliente</span>
            )}
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${emailStatusStyles[email.status] ?? fallbackEmailStatusStyle}`}>
              {email.status}
            </span>
          </div>
          <h4 className="font-bold text-white text-sm leading-tight break-words">{email.subject}</h4>
          <div className="text-[10px] text-neutral-500 font-mono mt-1" suppressHydrationWarning>
            {isMounted ? new Date(email.createdAt).toLocaleString('es-CL') : '...'}
          </div>
        </div>
        
        {isInbound && (
          <button 
            onClick={onReply}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#ea580c] hover:bg-[#ea580c]/80 text-white text-[10px] font-bold rounded uppercase transition-colors touch-manipulation"
          >
            <Reply className="w-3 h-3" /> Responder
          </button>
        )}
      </div>
      
      {email.error && (
        <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded mb-3 border border-red-500/20 break-words" title={email.error}>
          Error: {email.error}
        </div>
      )}

      {/* Main Message Body */}
      <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
        <div className="text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed break-words">
          {cleanBody}
        </div>

        {/* Quoted content (collapsed) */}
        {quotedBody && (
          <div className="mt-4 pt-4 border-t border-neutral-800/50">
            <button 
              onClick={() => setShowQuoted(!showQuoted)}
              className="flex items-center gap-1.5 text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors uppercase font-bold tracking-widest touch-manipulation"
            >
              {showQuoted ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showQuoted ? 'Ocultar hilo citado' : 'Ver hilo citado'}
            </button>
            
            {showQuoted && (
              <div className="mt-3 text-[10px] text-neutral-500 bg-neutral-900/30 p-3 rounded border border-neutral-800/50 italic whitespace-pre-wrap leading-relaxed break-words">
                {quotedBody}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Technical Footer */}
      <div className="mt-3 pt-3 border-t border-neutral-800/50">
        <button 
          onClick={() => setShowTechnical(!showTechnical)}
          className="text-[9px] text-neutral-600 hover:text-neutral-400 font-mono touch-manipulation"
        >
          {showTechnical ? 'Ocultar ID Técnico' : 'Mostrar ID Técnico'}
        </button>
        
        {showTechnical && (
          <div className="mt-2 flex flex-col gap-1 text-[9px] text-neutral-600 font-mono">
            <div>ID: {email.resendId || 'N/A'}</div>
            {email.deliveredAt && <div>Entregado: {new Date(email.deliveredAt).toLocaleString('es-CL')}</div>}
            {email.openedAt && <div className="text-[#ea580c]">Abierto: {new Date(email.openedAt).toLocaleString('es-CL')}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
