import { validateAdminAccess } from '@/lib/admin/permissions';
import { getSeoConfig } from '@/lib/actions/seo';
import { SeoForm } from '@/components/admin/seo-form';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DeveloperSeoPage() {
  await validateAdminAccess('DEVELOPER');

  const seo = await getSeoConfig();
  const pageKeys = ['inicio', 'servicios', 'empresa', 'portafolio', 'contacto'];
  
  const history = await prisma.seoHistory.findMany({
    orderBy: { changedAt: 'desc' },
    take: 5
  });

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4 flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-black text-white flex items-center gap-2">
             SEO Core 
             <span className="text-xs font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
                DEV ONLY
             </span>
           </h2>
           <p className="text-neutral-400 mt-1 text-sm">Configuración avanzada de indexación general.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <SeoForm seo={seo} pageKeys={pageKeys} />
         </div>
         <div className="space-y-6 shrink-0">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 sticky top-6">
               <h3 className="font-bold text-zinc-300 text-sm mb-4 border-b border-zinc-800 pb-2">Últimos Cambios Registrados</h3>
               {history.length === 0 ? (
                 <p className="text-sm text-zinc-500 font-mono">Sin cambios previos.</p>
               ) : (
                 <ul className="space-y-4">
                   {history.map((record) => (
                     <li key={record.id} className="text-xs font-mono flex flex-col gap-1 border-b border-zinc-800/50 pb-2">
                       <span className="text-orange-500">{new Date(record.changedAt).toLocaleString()}</span>
                       <span className="text-zinc-300 truncate font-sans font-medium" title={record.metaTitle || 'Sin título global'}>{record.metaTitle || 'Sin título global'}</span>
                       <span className="text-zinc-500">Por: {record.userId}</span>
                     </li>
                   ))}
                 </ul>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
