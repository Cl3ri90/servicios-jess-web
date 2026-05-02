'use client'

import { useState, useTransition } from 'react'
import { deleteLeadAction, replyLeadEmail } from '@/lib/actions/leads'

export function LeadActions({ leadId, leadEmail }: { leadId: string, leadEmail: string }) {
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isReplying, startReplyTransition] = useTransition()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [replyError, setReplyError] = useState('')
  const [replySuccess, setReplySuccess] = useState('')

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este Lead y sus datos corporativos? Esta acción no se puede deshacer.')) {
      startDeleteTransition(async () => {
        const res = await deleteLeadAction(leadId)
        if (res.error) {
          alert(res.error)
        }
      })
    }
  }

  const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReplyError('')
    setReplySuccess('')

    const formData = new FormData(e.currentTarget)
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    startReplyTransition(async () => {
      const res = await replyLeadEmail(leadId, subject, message)
      if (res.error) {
        setReplyError(res.error)
      } else if (res.success) {
        setReplySuccess(res.success)
        setTimeout(() => setIsModalOpen(false), 2000)
      }
    })
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 px-3 py-1.5 rounded transition-colors text-xs font-bold w-full uppercase tracking-wider"
        >
          Responder
        </button>
        <button 
          disabled={isDeleting}
          onClick={handleDelete}
          className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30 px-3 py-1.5 rounded transition-colors text-xs font-bold w-full disabled:opacity-50 uppercase tracking-wider disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Borrando' : 'Eliminar'}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              disabled={isReplying}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white disabled:opacity-50"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Responder a Lead</h3>
            <p className="text-sm text-neutral-400 mb-6">Destinatario: <span className="font-mono text-orange-400">{leadEmail}</span></p>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              {replyError && <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-400 text-sm rounded">{replyError}</div>}
              {replySuccess && <div className="p-3 bg-green-950/50 border border-green-500/50 text-green-400 text-sm rounded">{replySuccess}</div>}
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Asunto</label>
                <input required name="subject" defaultValue="RE: Solicitud Técnica en Servicios Jess" className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Cuerpo del Mensaje</label>
                <textarea required name="message" rows={6} className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 resize-none" placeholder="Escribe tu respuesta aquí..."></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isReplying} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 text-sm uppercase">Cancelar</button>
                <button type="submit" disabled={isReplying} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-colors text-sm uppercase flex items-center justify-center">
                  {isReplying ? 'Enviando email...' : 'Enviar Respuesta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
