import { prisma } from '@/lib/db/prisma'
import { ClientForm, DeleteClientButton } from '@/components/admin/ClientForm'

export default async function ClientesView({ tenantId }: { tenantId: string }) {
  // @ts-ignore
  const clientes = await prisma.client.findMany({
    where: { tenantId },
    orderBy: { order: 'asc' }
  })

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Trust y Clientes B2B</h2>
        <p className="text-neutral-400 mt-2">Configura los logos de empresas que confían en tu manufactura. Se usarán de prueba social en el Home.</p>
      </div>

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
