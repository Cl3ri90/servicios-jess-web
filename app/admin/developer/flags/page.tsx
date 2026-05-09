import { prisma } from '@/lib/prisma';
import { DeveloperFlagsTable } from '@/components/admin/developer-flags-table';
import { PublicModuleReorder } from '@/components/admin/PublicModuleReorder';
import { FLAG_CATALOG } from '@/lib/site/flags-catalog';
import { validateAdminAccess } from '@/lib/admin/permissions';

export const dynamic = 'force-dynamic';

export default async function DeveloperFlagsPage() {
  await validateAdminAccess('DEVELOPER');

  // Inicialización (Upsert) de módulos del catálogo que falten
  const existingKeys = await prisma.featureFlag.findMany({ select: { key: true } });
  const keySet = new Set(existingKeys.map(k => k.key));
  
  const toCreate = FLAG_CATALOG.filter(c => !keySet.has(c.key));
  if (toCreate.length > 0) {
     await Promise.all(
       toCreate.map(flag => 
         prisma.featureFlag.create({
           data: {
             key: flag.key,
             name: flag.name,
             description: flag.description,
             isActive: false, // Default todo inicia apagado hasta que lo active dev
             ownerVisible: false,
             ownerEditable: false,
             publicVisible: false
           }
         })
       )
     );
  }

  const flagsFromDb = await prisma.featureFlag.findMany({
    orderBy: { createdAt: 'asc' }
  });

  // Armamos el mapeo final uniendo las categorías locales de nuestro FLAG_CATALOG
  const finalFlags = flagsFromDb.map(dbFlag => {
    const matched = FLAG_CATALOG.find(c => c.key === dbFlag.key);
    return {
      ...dbFlag,
      category: matched?.category || 'Sistema'
    };
  });

  const activeCount = finalFlags.filter(f => f.isActive).length;
  const ownerVisibleCount = finalFlags.filter(f => f.ownerVisible).length;
  const publicCount = finalFlags.filter(f => f.publicVisible).length;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2">
              Feature Flags
              <span className="text-xs font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
                DEV ONLY
              </span>
           </h1>
           <p className="text-sm text-zinc-400 mt-1">
             Control de módulos visibles para Owner y sitio público.
           </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-black text-white font-mono">{finalFlags.length}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Módulos Totales</p>
         </div>
         <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-black text-orange-500 font-mono">{activeCount}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Motores Activos</p>
         </div>
         <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-black text-[#ea580c] font-mono">{ownerVisibleCount}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Visible CMS Owner</p>
         </div>
         <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-black text-green-500 font-mono">{publicCount}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Front-end Público</p>
         </div>
      </div>

      <PublicModuleReorder initialFlags={finalFlags} />

      <DeveloperFlagsTable initialFlags={finalFlags} />
    </div>
  );
}
