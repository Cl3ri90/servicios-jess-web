import { checkDeveloper } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DeveloperCapacidadesPage() {
  await checkDeveloper();

  const flag = await prisma.featureFlag.findUnique({
    where: { key: 'capacidades' }
  });

  const count = await prisma.serviceCapability.count();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 font-mono">/modulos/{flag?.key}</h1>
          <p className="text-sm text-zinc-400">Auditoría de integridad tabular y exposición del FeatureFlag.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h3 className="font-semibold text-orange-500 font-mono mb-4">// ESTADO BINARIO (DB ROOT)</h3>
          <ul className="space-y-2 text-sm font-mono text-zinc-300">
            <li className="flex justify-between border-b border-zinc-800 pb-1">
              <span>isActive</span>
              <span className={flag?.isActive ? "text-green-500" : "text-red-500"}>{String(flag?.isActive)}</span>
            </li>
            <li className="flex justify-between border-b border-zinc-800 pb-1">
              <span>ownerVisible</span>
              <span className={flag?.ownerVisible ? "text-green-500" : "text-red-500"}>{String(flag?.ownerVisible)}</span>
            </li>
            <li className="flex justify-between border-b border-zinc-800 pb-1">
              <span>ownerEditable</span>
              <span className={flag?.ownerEditable ? "text-green-500" : "text-red-500"}>{String(flag?.ownerEditable)}</span>
            </li>
          </ul>
          
          <div className="mt-6">
            <Link href="/admin/developer/flags" className="text-xs bg-zinc-800 px-3 py-2 text-white hover:bg-zinc-700 font-sans rounded">
              Ir a Panel Maestro de Flags
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <h3 className="font-semibold text-orange-500 font-mono mb-4">// INTEGRIDAD DE DATOS</h3>
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 text-sm">Registros en ServiceCapability:</p>
            <span className="text-2xl font-bold text-white">{count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
