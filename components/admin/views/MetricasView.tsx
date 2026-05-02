import { prisma } from '@/lib/db/prisma'
import { MetricForm, DeleteMetricButton } from '@/components/admin/MetricForm'

export default async function MetricasView({ tenantId }: { tenantId: string }) {
  // @ts-ignore
  const metricas = await prisma.metric.findMany({
    where: { tenantId },
    orderBy: { order: 'asc' }
  })

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Indicadores B2B</h2>
        <p className="text-neutral-400 mt-2">Controla los hitos numéricos proyectados en la banda del Home.</p>
      </div>

      <MetricForm tenantId={tenantId} />

      <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b border-neutral-800 pb-2 border-t mt-8 pt-8">KPIs Activos</h3>
      <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
        <table className="w-full text-left text-sm text-neutral-400">
           <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
              <tr>
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Etiqueta</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody>
              {metricas.map((m: any) => (
                <tr key={m.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                   <td className="px-6 py-4 font-mono text-xs">{m.order}</td>
                   <td className="px-6 py-4 font-black text-orange-500 text-lg">{m.value}</td>
                   <td className="px-6 py-4 font-bold text-white uppercase tracking-widest text-xs">{m.label}</td>
                   <td className="px-6 py-4 text-right">
                      <DeleteMetricButton id={m.id} />
                   </td>
                </tr>
              ))}
              {metricas.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 font-light">
                     No hay indicadores.
                   </td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}
