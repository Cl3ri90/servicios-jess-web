import { prisma } from '@/lib/db/prisma'
import { AgendaForms, BookingManager, BlockManager } from '@/components/admin/AgendaForms'

export default async function AgendaView({ tenantId }: { tenantId: string }) {
  // Get active entities for the forms
  const boxes = await prisma.clinicBox.findMany({ where: { tenantId, isActive: true }, orderBy: { name: 'asc' } })
  const practitioners = await prisma.practitioner.findMany({ where: { tenantId, isActive: true }, orderBy: { name: 'asc' } })

  // GET BOOKINGS - Strict Isolation
  const bookings = await prisma.boxBooking.findMany({
    where: { tenantId },
    orderBy: { startTime: 'desc' },
    include: {
      box: true,
      practitioner: true,
    }
  })

  // GET BLOCKED SLOTS - Strict Isolation
  const blockedSlots = await prisma.boxBlockedSlot.findMany({
    where: { tenantId, isActive: true },
    orderBy: { startTime: 'desc' },
    include: {
      box: true,
    }
  })

  // Combine bookings and blocked slots into a unified chronological array
  // We'll map them to a common interface for the table
  const timeline = [
    ...bookings.map((b: any) => ({
      type: 'booking' as const,
      id: b.id,
      start: b.startTime,
      end: b.endTime,
      boxName: b.box?.name || b.boxNameSnapshot,
      practitionerName: b.practitioner?.name || b.practitionerNameSnapshot,
      status: b.status,
      notes: b.notes,
      price: b.price?.toString(),
    })),
    ...blockedSlots.map((b: any) => ({
      type: 'block' as const,
      id: b.id,
      start: b.startTime,
      end: b.endTime,
      boxName: b.box?.name,
      practitionerName: '(Uso Interno / Mantenimiento)',
      status: 'BLOCKED',
      notes: b.reason,
      price: '-',
    }))
  ].sort((a, b) => b.start.getTime() - a.start.getTime()) // Descending (future -> past)

  const formatTime = (d: Date) => d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Agenda Operativa</h2>
        <p className="text-neutral-400 mt-2">Visión general cronológica de los recursos físicos (Boxes).</p>
      </div>

      <AgendaForms boxes={boxes} practitioners={practitioners} tenantId={tenantId} />

      <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6 border-b border-neutral-800 pb-2 border-t mt-8 pt-8">Línea de Tiempo Operativa</h3>
      
      <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-lg">
        <table className="w-full text-left text-sm text-neutral-400">
           <thead className="bg-neutral-950 text-xs uppercase font-bold text-neutral-300">
              <tr>
                <th className="px-6 py-4">Box</th>
                <th className="px-6 py-4">Horario</th>
                <th className="px-6 py-4">Usuario / Notas</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody>
              {timeline.map((item) => {
                const isBlock = item.type === 'block'
                return (
                  <tr key={item.id} className={`border-b border-neutral-800 transition-colors ${isBlock ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-neutral-800/50'}`}>
                    <td className="px-6 py-4 font-bold text-white">{item.boxName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-neutral-300">
                      <div>{formatTime(item.start)}</div>
                      <div className="text-neutral-500">hasta</div>
                      <div>{formatTime(item.end)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-bold ${isBlock ? 'text-red-400' : 'text-neutral-200'}`}>{item.practitionerName}</p>
                      <p className="text-xs text-neutral-500 italic mt-1">{item.notes || ''}</p>
                    </td>
                    <td className="px-6 py-4">
                      {isBlock && <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs">Bloqueo Sistema</span>}
                      {item.status === 'CONFIRMED' && <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">Confirmada</span>}
                      {item.status === 'PENDING' && <span className="text-orange-400 bg-orange-400/10 px-2 py-1 rounded text-xs">Pendiente</span>}
                      {item.status === 'CANCELLED' && <span className="text-neutral-500 bg-neutral-500/10 px-2 py-1 rounded text-xs">Cancelada</span>}
                      {item.status === 'COMPLETED' && <span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded text-xs">Completada</span>}
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                      {isBlock ? <BlockManager id={item.id} /> : <BookingManager id={item.id} status={item.status} />}
                    </td>
                  </tr>
                )
              })}
              {timeline.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-neutral-500 font-light">No hay registros en la agenda.</td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}
