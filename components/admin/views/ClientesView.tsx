import { prisma } from '@/lib/db/prisma'
import { ClientForm, DeleteClientButton } from '@/components/admin/ClientForm'
import { getModuleFlag } from '@/lib/site/get-module-flag'
import { TrustConfigForm } from '@/components/admin/TrustConfigForm'

export default async function ClientesView({ tenantId }: { tenantId: string }) {
  // @ts-ignore
  const clientes = await prisma.client.findMany({
    where: { tenantId },
    orderBy: { order: 'asc' }
  })

  const flag = await getModuleFlag('trust')
  const siteConfig = await prisma.siteConfig.findUnique({ where: { id: "singleton" } })
  const currentSpeed = siteConfig?.trustCarouselSpeed || 35

  // Diagnostic logic
  let diagnostic = { status: 'success', text: 'Visible en web pública' };
  if (!flag.isActive) {
    diagnostic = { status: 'error', text: 'El motor principal del módulo está apagado.' };
  } else if (!flag.renderPublic) {
    diagnostic = { status: 'warning', text: 'Render público desactivado desde Feature Flags.' };
  } else if (clientes.length === 0) {
    diagnostic = { status: 'warning', text: 'No hay logos cargados.' };
  } else if (!clientes.some((c: any) => c.logoUrl)) {
    diagnostic = { status: 'warning', text: 'Hay clientes registrados, pero no tienen logo válido.' };
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Trust y Clientes B2B</h2>
        <p className="text-neutral-400 mt-2">Configura los logos de empresas que confían en tu manufactura. Se usarán de prueba social en el Home.</p>
      </div>

      <div className="mb-8 p-5 rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4">Estado de Render Público</h3>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border font-bold text-sm tracking-wide ${
          diagnostic.status === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
          diagnostic.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
          'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {diagnostic.status === 'success' && <span>✅</span>}
          {diagnostic.status === 'warning' && <span>🟡</span>}
          {diagnostic.status === 'error' && <span>🔴</span>}
          {diagnostic.text}
        </div>
        {diagnostic.status !== 'success' && (
          <p className="mt-3 text-xs text-neutral-400">
            Resuelve esta advertencia para que la franja de logos aparezca en la página de inicio.
          </p>
        )}
      </div>

      <TrustConfigForm currentSpeed={currentSpeed} />

      <ClientForm tenantId={tenantId} />

      <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b border-neutral-800 pb-2 border-t mt-8 pt-8">Logos Activos</h3>
      <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
        <table className="w-full text-left text-sm text-neutral-400">
           <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
              <tr>
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Logo</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody>
              {clientes.map((c: any) => (
                <tr key={c.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                   <td className="px-6 py-4 font-mono text-xs">{c.order}</td>
                   <td className="px-6 py-4">
                     {c.logoUrl ? <img src={c.logoUrl} alt="Logo" className="w-16 h-8 object-contain bg-white rounded p-1" /> : 'Solo texto'}
                   </td>
                   <td className="px-6 py-4 font-bold text-white uppercase tracking-widest text-xs">{c.name}</td>
                   <td className="px-6 py-4 text-right">
                      <DeleteClientButton id={c.id} />
                   </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 font-light">
                     No hay clientes listados.
                   </td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}
