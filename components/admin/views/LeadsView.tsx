import { prisma } from '@/lib/db/prisma'
import { LeadActions } from '@/app/admin/owner/leads/LeadActions'

export default async function LeadsView({ tenantId }: { tenantId: string }) {
  const leads = await prisma.lead.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Bandeja de Leads Comerciales</h2>
        <p className="text-neutral-400 mt-2">Mensajes entrantes y requerimientos recolectados desde el portal público.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
           <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
              <tr>
                <th className="px-6 py-4">Ingreso</th>
                <th className="px-6 py-4">Empresa / Cliente</th>
                <th className="px-6 py-4 hidden md:table-cell">Contacto</th>
                <th className="px-6 py-4">Requerimiento</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
           </thead>
           <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors align-top">
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                     <div className="font-mono">{new Date(lead.createdAt).toLocaleDateString()}</div>
                     <div className="mt-2 flex flex-col gap-1">
                       {lead.status === 'NEW' && <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest inline-block text-center shadow-lg">Nuevo Solicitante</span>}
                       {lead.status === 'RESPONDED' && <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest inline-block text-center shadow-lg">Respondido</span>}
                       {lead.emailStatus === 'failed' && <span title={lead.emailError || 'API Limit'} className="bg-red-950 text-red-500 border border-red-500/50 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest inline-block text-center shadow-lg cursor-help">Fail: Resend Test</span>}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        {lead.company || 'Particular'}
                        {lead.source === 'quote-modal' ? (
                          <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest whitespace-nowrap">Modal</span>
                        ) : (
                          <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest whitespace-nowrap">Web</span>
                        )}
                      </div>
                      <div className="text-xs">{lead.name}</div>
                   </td>
                   <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-orange-400">{lead.email}</div>
                      <div className="text-xs font-mono mt-1">{lead.phone || '-'}</div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="bg-neutral-950 p-3 rounded text-neutral-300 text-xs whitespace-pre-wrap max-h-40 overflow-y-auto border border-neutral-800">
                       {lead.message}
                     </div>
                   </td>
                   <td className="px-4 py-4 align-middle">
                      <LeadActions leadId={lead.id} leadEmail={lead.email} />
                   </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 font-light">
                     La bandeja está vacía. Aún no hay solicitudes B2B ingresadas al sistema.
                   </td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}
