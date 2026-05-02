import { prisma } from '@/lib/prisma';
import { checkOwnerAccess } from '@/lib/admin/permissions';
import { OwnerSiteForm } from '@/components/admin/owner-site-form';

export const dynamic = 'force-dynamic';

export default async function OwnerConfigPage() {
  const { flag } = await checkOwnerAccess('configuracion_owner');
  
  const config = await prisma.siteConfig.findUnique({
    where: { id: 'singleton' }
  });

  const initialData = {
    contactEmail: config?.contactEmail || '',
    contactPhone: config?.contactPhone || '',
    contactAddress: config?.contactAddress || '',
    heroTitle: config?.heroTitle || '',
    heroSubtitle: config?.heroSubtitle || '',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Configuración Operativa</h1>
        {!flag?.ownerEditable && (
          <span className="text-xs font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
            SOLO LECTURA
          </span>
        )}
      </div>
      
      <p className="text-sm text-zinc-400">
        Gestiona la información pública de contacto y los mensajes base de la portada de Servicios Jess.
      </p>

      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        <OwnerSiteForm initialData={initialData} isReadOnly={!flag || !flag.ownerEditable} />
      </div>
    </div>
  );
}
