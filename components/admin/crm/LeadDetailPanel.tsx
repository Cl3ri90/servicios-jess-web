'use client'

import { useState, useEffect } from 'react'
import { Lead, LeadActivity, LeadEmail } from '@prisma/client'
import { getLeadById, updateLeadNote, setLeadFollowUp, archiveLead, updateLeadPriority } from '@/lib/actions/contact-leads'
import { sendLeadManualReply } from '@/lib/email/lead-emails'
import { X, Building2, Mail, Phone, Clock, Calendar, Check, AlertCircle, FileText, Activity, Trash2, Link, Send } from 'lucide-react'

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

  const [activeTab, setActiveTab] = useState<'info' | 'reply' | 'emails'>('info')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getLeadById(initialLead.id).then(data => {
      if (isMounted && data) {
        setLead(data as LeadWithActivitiesAndEmails);
        setNote(data.internalNote || '');
        if (data.nextFollowUpAt) {
          setFollowUpDate(new Date(data.nextFollowUpAt).toISOString().split('T')[0]);
        }
      }
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false };
  }, [initialLead.id]);

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
                {lead.status}
              </span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-300 border border-neutral-700">
                SCORE: {lead.score}
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
          <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white transition-colors bg-neutral-900 rounded-lg">
            <X className="w-5 h-5" />
          </button>
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
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* TAB: INFO */}
          {activeTab === 'info' && (
            <>
              <div className="p-6 border-b border-neutral-800/50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Email</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Mail className="w-4 h-4 text-neutral-500" />
                      <a href={`mailto:${lead.email}`} className="hover:text-orange-400 transition-colors">{lead.email}</a>
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

              <div className="p-6 border-b border-neutral-800/50 grid grid-cols-2 gap-6 bg-neutral-900/20">
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
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-neutral-800">
                  {lead.activities.map((activity) => (
                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-neutral-950 bg-neutral-700 text-neutral-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10" />
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-neutral-900 p-4 rounded border border-neutral-800 shadow">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-white text-xs">{activity.title}</div>
                          <div className="text-[10px] text-neutral-500 font-mono" suppressHydrationWarning>
                            {isMounted ? new Date(activity.createdAt).toLocaleDateString() : '...'}
                          </div>
                        </div>
                        {activity.note && (
                          <div className="text-xs text-neutral-400 mt-2 bg-neutral-950/50 p-2 rounded">
                            {activity.note}
                          </div>
                        )}
                      </div>
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
            <div className="p-6">
              <div className="mb-6 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <button type="button" onClick={() => applyTemplate('Solicitud recibida', 'Hola {name},\n\nHemos recibido tu solicitud. Nuestro equipo técnico la está revisando y nos pondremos en contacto contigo pronto.')} className="whitespace-nowrap px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Solicitud recibida</button>
                <button type="button" onClick={() => applyTemplate('Más antecedentes', 'Hola {name},\n\nPara poder entregar una cotización precisa, ¿podrías facilitarnos los planos o mayor información técnica de tu requerimiento?')} className="whitespace-nowrap px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Más antecedentes</button>
                <button type="button" onClick={() => applyTemplate('Coordinar contacto', 'Hola {name},\n\nNos gustaría coordinar una breve llamada para entender mejor tu proyecto. ¿Qué día y horario te acomoda?')} className="whitespace-nowrap px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700 transition-colors border border-neutral-700">Coordinar contacto</button>
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
                  <textarea required value={replyBody} onChange={e => setReplyBody(e.target.value)} className="w-full h-48 bg-neutral-950 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#ea580c] resize-none transition-colors" placeholder="Escribe tu respuesta aquí..." />
                </div>

                {replyError && (
                  <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">
                    {replyError}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={sendingReply || lead.status === 'ARCHIVED'} className="flex items-center gap-2 px-6 py-2 bg-[#ea580c] hover:bg-[#ea580c]/80 text-white font-bold rounded transition-colors disabled:opacity-50">
                    {sendingReply ? 'Enviando...' : <><Send className="w-4 h-4" /> Enviar Respuesta</>}
                  </button>
                </div>
                {lead.status === 'ARCHIVED' && <p className="text-xs text-neutral-500 text-right mt-2">No puedes enviar correos a un lead archivado.</p>}
              </form>
            </div>
          )}

          {/* TAB: EMAILS */}
          {activeTab === 'emails' && (
            <div className="p-6">
              {lead.emails && lead.emails.length > 0 ? (
                <div className="space-y-4">
                  {lead.emails.map(email => (
                    <div key={email.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {email.direction === 'OUTBOUND' ? (
                              <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700 uppercase">Enviado al Cliente</span>
                            ) : (
                              <span className="text-[10px] font-bold bg-[#ea580c]/20 text-[#ea580c] px-2 py-0.5 rounded border border-[#ea580c]/30 uppercase">Respuesta del Cliente</span>
                            )}
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${emailStatusStyles[email.status] ?? fallbackEmailStatusStyle}`}>
                              {email.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-sm">{email.subject}</h4>
                          <div className="text-[10px] text-neutral-500 font-mono mt-1" suppressHydrationWarning>
                            {isMounted ? new Date(email.createdAt).toLocaleString('es-CL') : '...'}
                          </div>
                        </div>
                      </div>
                      
                      {email.error && (
                        <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded mb-3 border border-red-500/20 line-clamp-2" title={email.error}>
                          Error: {email.error}
                        </div>
                      )}

                      {email.direction === 'INBOUND' && email.htmlBody ? (
                        <div className="bg-neutral-950 p-4 rounded-lg overflow-hidden border border-neutral-800">
                          <div 
                            className="text-xs text-neutral-300 max-h-[400px] overflow-y-auto custom-scrollbar prose prose-invert prose-xs max-w-none"
                            dangerouslySetInnerHTML={{ __html: email.htmlBody }}
                          />
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded line-clamp-4 whitespace-pre-wrap">
                          {email.body.replace(/<[^>]*>?/gm, '')}
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                        <div>ID: {email.resendId || 'N/A'}</div>
                        <div className="flex gap-3">
                          {email.deliveredAt && <span>Delivered: {new Date(email.deliveredAt).toLocaleTimeString('es-CL')}</span>}
                          {email.openedAt && <span className="text-[#ea580c]">Opened: {new Date(email.openedAt).toLocaleTimeString('es-CL')}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
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
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors disabled:opacity-30"
            >
              Marcar Ganado
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
