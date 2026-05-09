import { prisma } from '@/lib/db/prisma'
import { MetricForm, DeleteMetricButton } from '@/components/admin/MetricForm'
import { getModuleFlag } from '@/lib/site/get-module-flag'
import { KpiSection } from '@/components/site/kpi-section'

export default async function MetricasView({ tenantId }: { tenantId: string }) {
  // @ts-ignore
  const metricas = await prisma.metric.findMany({
    where: { tenantId },
    orderBy: { order: 'asc' }
  })

  const flag = await getModuleFlag('indicadores');

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Indicadores B2B</h2>
        <p className="text-neutral-400 mt-2">Controla los hitos numéricos proyectados en la banda del Home.</p>
      </div>

      {(!flag.isActive || !flag.renderPublic || metricas.length === 0) && (
        <div className="mb-8 p-4 bg-orange-950/30 border border-orange-900/50 rounded-lg">
          <h4 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
            <span className="text-lg">⚠</span> Estado de Publicación
          </h4>
          <ul className="text-orange-400/80 text-sm list-disc pl-5 space-y-1">
            {!flag.isActive && <li>El motor principal del módulo está apagado.</li>}
            {!flag.renderPublic && <li>"Renderizar Público (Frontend)" está desactivado.</li>}
            {metricas.length === 0 && <li>La sección no se mostrará en la web mientras no existan registros activos.</li>}
          </ul>
        </div>
      )}

      <MetricForm tenantId={tenantId} />

      {metricas.length > 0 && (
        <>
          <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b border-neutral-800 pb-2 border-t mt-12 pt-8">
            Live Preview Pública
          </h3>
          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950 mb-12 relative">
            <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-800 text-xs font-mono text-neutral-500 absolute top-0 left-0 right-0 z-50">
               Vista previa interactiva
            </div>
            <div className="pt-10 bg-black">
              <KpiSection metrics={metricas} />
            </div>
          </div>
        </>
      )}

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
