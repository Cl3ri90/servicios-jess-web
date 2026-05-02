import { checkOwnerAccess } from '@/lib/admin/permissions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OwnerModulePage({ params }: { params: Promise<{ modulo: string }> }) {
  const { modulo } = await params;
  
  // Validate basic access to flag
  const { flag } = await checkOwnerAccess(modulo);

  if (!flag) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{flag.name}</h1>
          <p className="text-sm font-mono text-orange-500">const isActive = {flag.isActive ? 'true' : 'false'};</p>
        </div>
        {!flag.ownerEditable && (
          <span className="text-xs font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
            SOLO LECTURA
          </span>
        )}
      </div>

      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/10 min-h-[400px]">
        <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 border border-zinc-700">
          <span className="text-zinc-500 font-mono text-xs">EOF</span>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Módulo en Construcción</h3>
        <p className="text-zinc-500 max-w-md">
          El administrador global ha habilitado la visibilidad de este módulo operativo, pero los contenedores de datos aún no han sido desplegados en el clúster. 
        </p>
        <p className="text-xs font-mono text-zinc-600 mt-6">
          // Requesting data for: {modulo}
        </p>
      </div>
    </div>
  );
}
