import { prisma } from '@/lib/db/prisma'
import { PractitionerForm } from '@/components/admin/PractitionerForm'
import PlanLimitBanner from '@/components/admin/PlanLimitBanner'
import Link from 'next/link'


export default async function PractitionerView({ 
  tenantId, 
  searchParams, 
  baseUrl 
}: { 
  tenantId: string
  searchParams: { editId?: string }
  baseUrl: string
}) {
  const practitioners = await prisma.practitioner.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })

  // @ts-ignore
  const activeEdit = searchParams.editId ? await prisma.practitioner.findFirst({ where: { id: searchParams.editId, tenantId } }) : null

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { subscriptionTier: true }
  })


  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Gestión de Profesionales</h2>
        <p className="text-neutral-400 mt-2">Registra a los profesionales u odontólogos que arriendan los boxes.</p>
      </div>

      {activeEdit && (
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 mb-6 rounded text-orange-200 flex justify-between items-center">
          <span><strong>Modo Edición:</strong> Modificando "{activeEdit.name}"</span>
          <Link href={baseUrl} className="text-orange-500 hover:text-orange-400 underline text-sm">Cancelar</Link>
        </div>
      )}

      {/* Validaciones UX visuales para Upsell de Límite de Profesionales */}
      <PlanLimitBanner tenantId={tenantId} />

      {/* Condicionamos el formulario: si está editando lo mostramos. Si está creando nuevo, solo lo mostramos si NO superó el límite */}
      {(() => {
        const activeCount = practitioners.filter(p => p.isActive).length;
        const limitMapping: Record<string, number> = {
          'BASIC': 10,
          'PRO': 50,
          'PREMIUM': 999999
        }
        const limit = limitMapping[tenant?.subscriptionTier || 'BASIC'] || 10;
        const isCapped = activeCount >= limit;

        if (!isCapped || activeEdit) {
          return (
            <PractitionerForm initialData={activeEdit} tenantId={tenantId} />
          )
        }
        return null;
      })()}

      <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b border-neutral-800 pb-2 border-t mt-8 pt-8">Directorio</h3>
      
      <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
        <table className="w-full text-left text-sm text-neutral-400">
           <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
              <tr>
                <th className="px-6 py-4">Nombre / Especialidad</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody>
              {practitioners.map((p) => (
                <tr key={p.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                   <td className="px-6 py-4">
                     <p className="font-bold text-white">{p.name}</p>
                     <p className="text-xs text-neutral-500">{p.specialty || 'Sin especialidad'}</p>
                   </td>
                   <td className="px-6 py-4 font-mono text-xs">
                     <p>{p.email || '-'}</p>
                     <p>{p.phone || '-'}</p>
                   </td>
                   <td className="px-6 py-4">
                     {p.isActive 
                       ? <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">Activo</span>
                       : <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs">Inactivo</span>}
                   </td>
                   <td className="px-6 py-4 text-right">
                      <Link href={`${baseUrl}?editId=${p.id}`} className="text-blue-500 text-sm font-medium hover:underline">
                        Editar
                      </Link>
                   </td>
                </tr>
              ))}
              {practitioners.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 font-light">No hay profesionales registrados.</td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}
