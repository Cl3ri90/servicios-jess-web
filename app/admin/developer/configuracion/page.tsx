import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DeveloperConfigForm } from '@/components/admin/developer-config-form';
import { validateAdminAccess } from '@/lib/admin/permissions';

export const dynamic = 'force-dynamic';

export default async function DeveloperConfigPage() {
  await validateAdminAccess('DEVELOPER');

  const config = await prisma.siteConfig.findUnique({
    where: { id: 'singleton' }
  });

  if (!config) notFound();

  const initialData = {
    name: config.name || '',
    primaryColor: config.primaryColor || '',
    metaTitle: config.metaTitle || '',
    isMaintenance: config.isMaintenance,
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <h1 className="text-3xl font-black tracking-tight text-zinc-100 uppercase">Configuración Maestra</h1>
      </div>
      
      <p className="text-sm text-zinc-400 font-medium">
        Modifica la raíz estructural del sistema y parámetros críticos.
      </p>

      <DeveloperConfigForm initialData={initialData} />
    </div>
  );
}
