import { checkOwnerAccess } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ServiceCapabilityForm } from '@/components/admin/service-capability-form';

export const dynamic = 'force-dynamic';

export default async function CapacidadesOwnerPage(props: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { flag } = await checkOwnerAccess('capacidades');
  if (!flag) notFound();

  const services = await prisma.serviceCapability.findMany({
    orderBy: { order: 'asc' }
  });

  const activeService = searchParams.edit 
    ? services.find((s) => s.id === searchParams.edit)
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{flag.name}</h1>
          <p className="text-sm text-zinc-400">Gestiona el listado de capacidades técnicas de tu maestranza.</p>
        </div>
        {!flag.ownerEditable && (
          <span className="text-xs font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
            SOLO LECTURA
          </span>
        )}
      </div>

      <div className="flex flex-col gap-y-12 max-w-full overflow-hidden">
        {/* SECCIÓN SUPERIOR: EDITOR */}
        {flag.ownerEditable && (
          <div id="editor-section" className="w-full min-w-0">
            <ServiceCapabilityForm key={activeService?.id || 'new'} initialData={activeService} />
          </div>
        )}

        <hr className="border-zinc-800" />

        {/* SECCIÓN INFERIOR: LISTADO */}
        <div className="w-full min-w-0">
          <h2 className="text-[#ea580c] font-bold tracking-tighter uppercase mb-6">
            Capacidades Activas
          </h2>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 min-h-[300px]">
              <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 border border-zinc-700">
                <span className="text-zinc-500 font-mono text-xs">0</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No hay registros</h3>
              <p className="text-zinc-500 max-w-sm text-sm">
                No has agregado ninguna capacidad industrial todavía. Utiliza el panel superior para agregar tu primer servicio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {services.map((svc: any) => (
                <div key={svc.id} className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 min-w-0 flex flex-col gap-2 relative group hover:border-[#ea580c]/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-white">{svc.title}</h4>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-1 rounded">#{svc.order}</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{svc.shortDescription}</p>
                  <div className="mt-2 text-xs font-mono">
                    <span className={svc.isActive ? "text-green-500" : "text-zinc-500"}>
                      {svc.isActive ? '[ACTIVO]' : '[OCULTO]'}
                    </span>
                  </div>
                  
                  {flag.ownerEditable && (
                    <Link scroll={false} href={`?edit=${svc.id}#editor-section`} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl cursor-pointer">
                       <p className="text-orange-500 font-mono text-xs border border-orange-500/50 px-3 py-1 bg-orange-500/10 rounded font-bold tracking-widest hover:bg-orange-500 hover:text-white transition-colors uppercase">
                         Editar Registro
                       </p>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
