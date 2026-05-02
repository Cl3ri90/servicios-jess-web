import { prisma } from '@/lib/db/prisma'
import { BoxForm } from '@/components/admin/BoxForm'
import Link from 'next/link'

export default async function BoxesView({ 
  tenantId, 
  searchParams, 
  baseUrl 
}: { 
  tenantId: string
  searchParams: { editId?: string }
  baseUrl: string
}) {
  const boxes = await prisma.clinicBox.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })

  // @ts-ignore
  const activeEdit = searchParams.editId ? await prisma.clinicBox.findFirst({ where: { id: searchParams.editId, tenantId } }) : null

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Gestión de Boxes</h2>
        <p className="text-neutral-400 mt-2">Configura los consultorios físicos disponibles en tu clínica.</p>
      </div>

      {activeEdit && (
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 mb-6 rounded text-orange-200 flex justify-between items-center">
          <span><strong>Modo Edición:</strong> Modificando "{activeEdit.name}"</span>
          <Link href={baseUrl} className="text-orange-500 hover:text-orange-400 underline text-sm">Cancelar</Link>
        </div>
      )}

      <BoxForm initialData={activeEdit} tenantId={tenantId} />

      <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b border-neutral-800 pb-2 border-t mt-8 pt-8">Boxes Registrados</h3>
      
      <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
        <table className="w-full text-left text-sm text-neutral-400">
           <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
              <tr>
                <th className="px-6 py-4">Box</th>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody>
              {boxes.map((b) => (
                <tr key={b.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                   <td className="px-6 py-4 font-bold text-white">{b.name}</td>
                   <td className="px-6 py-4 font-mono text-xs">{b.code || '-'}</td>
                   <td className="px-6 py-4">
                     {b.isActive 
                       ? <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">Activo</span>
                       : <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs">Inactivo</span>}
                   </td>
                   <td className="px-6 py-4 text-right">
                      <Link href={`${baseUrl}?editId=${b.id}`} className="text-blue-500 text-sm font-medium hover:underline">
                        Editar
                      </Link>
                   </td>
                </tr>
              ))}
              {boxes.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 font-light">No tienes boxes configurados.</td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}
