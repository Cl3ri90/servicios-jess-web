import { prisma } from '@/lib/db/prisma'
import { PortfolioForm, DeletePortfolioButton } from '@/components/admin/PortfolioForm'
import Link from 'next/link'

export default async function PortafolioView({ 
  tenantId, 
  searchParams, 
  baseUrl 
}: { 
  tenantId: string
  searchParams: { editId?: string }
  baseUrl: string
}) {
  const portfolios = await prisma.portfolio.findMany({
    where: { tenantId },
    orderBy: { order: 'asc' }
  })

  // @ts-ignore - Temporary ignore until restart
  const activePortfolio = searchParams.editId ? await prisma.portfolio.findUnique({ where: { id: searchParams.editId, tenantId } }) : null

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Casos de Éxito y Portafolio</h2>
        <p className="text-neutral-400 mt-2">Visibilidad de trabajos entregados para demostrar tu capacidad técnica instalada a futuros clientes.</p>
      </div>

      {activePortfolio && (
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 mb-6 rounded text-orange-200">
          <strong>Modo Edición:</strong> Modificando "{activePortfolio.title}"
        </div>
      )}

      <PortfolioForm initialData={activePortfolio} tenantId={tenantId} />

      <h3 className="text-xl font-bold uppercase tracking-widest text-[#f5f5f5] mb-6 border-b border-neutral-800 pb-2 border-t mt-8 pt-8">Portafolio Público</h3>
      <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
        <table className="w-full text-left text-sm text-neutral-400">
           <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
              <tr>
                <th className="px-6 py-4">Proyecto</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody>
              {portfolios.map((p: any) => (
                <tr key={p.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                   <td className="px-6 py-4 font-bold text-white flex items-center gap-4">
                     {p.featuredImage && <img src={p.featuredImage} alt="Fotografía" className="w-10 h-10 object-cover rounded shadow border border-neutral-700 block" />}
                     {p.title}
                   </td>
                   <td className="px-6 py-4 text-xs font-mono">{p.clientName || '-'}</td>
                   <td className="px-6 py-4 uppercase tracking-widest text-xs text-[#ea580c]">{p.category || '-'}</td>
                   <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                      <Link href={`${baseUrl}?editId=${p.id}`} className="text-[#ea580c] text-sm font-medium hover:underline">
                        Editar
                      </Link>
                      <DeletePortfolioButton id={p.id} />
                   </td>
                </tr>
              ))}
              {portfolios.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-12 text-center border-t border-zinc-800">
                     <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30">
                        <span className="text-zinc-500 font-mono text-sm">Aún no hay proyectos publicados.</span>
                     </div>
                   </td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}
