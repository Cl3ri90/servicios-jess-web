import { prisma } from '@/lib/db/prisma'
import { ServiceForm, DeleteServiceButton } from '@/components/admin/ServiceForm'
import Link from 'next/link'

export default async function ServiciosView({ 
  tenantId, 
  searchParams, 
  baseUrl 
}: { 
  tenantId: string
  searchParams: { editId?: string }
  baseUrl: string
}) {
  const servicios = await prisma.service.findMany({
    where: { tenantId },
    orderBy: { order: 'asc' }
  })

  // @ts-ignore - Temporary ignore while user needs to restart server for runtime client generation
  const activeService = searchParams.editId ? await prisma.service.findUnique({ where: { id: searchParams.editId, tenantId } }) : null

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Gestión de Capacidades y Servicios</h2>
        <p className="text-neutral-400 mt-2">Agrega, edita o elimina los servicios que ofrece esta planta B2B.</p>
      </div>

      {activeService && (
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 mb-6 rounded text-orange-200">
          <strong>Modo Edición:</strong> Modificando "{activeService.title}"
        </div>
      )}

      <ServiceForm initialData={activeService} tenantId={tenantId} />

      <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b border-neutral-800 pb-2 border-t mt-8 pt-8">Catálogo Activo</h3>
      <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
        <table className="w-full text-left text-sm text-neutral-400">
           <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
              <tr>
                <th className="px-6 py-4">Servicio</th>
                <th className="px-6 py-4">Slug (URL)</th>
                <th className="px-6 py-4">Foto</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody>
              {servicios.map((s: any) => (
                <tr key={s.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                   <td className="px-6 py-4 font-bold text-white">{s.title}</td>
                   <td className="px-6 py-4 font-mono text-xs">{s.slug}</td>
                   <td className="px-6 py-4">
                     {s.featuredImage ? <img src={s.featuredImage} alt="Foto" className="w-12 h-8 object-cover rounded shadow" /> : 'Sin Foto'}
                   </td>
                   <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                      <Link href={`${baseUrl}?editId=${s.id}`} className="text-blue-500 text-sm font-medium hover:underline">
                        Editar
                      </Link>
                      <DeleteServiceButton id={s.id} />
                   </td>
                </tr>
              ))}
              {servicios.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 font-light">No tienes servicios listados. Usa el formulario de la parte superior.</td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}
