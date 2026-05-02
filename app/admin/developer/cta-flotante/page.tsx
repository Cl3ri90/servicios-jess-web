import { validateAdminAccess } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { FloatingCTAForm } from '@/components/admin/floating-cta-form';

export const dynamic = 'force-dynamic';

export default async function FloatingCTADeveloperPage() {
  await validateAdminAccess('DEVELOPER');

  // Instanciamos upsert vacío directamente si no existe, o encontramos
  const cta = await prisma.floatingCTA.findUnique({ where: { id: 'floating-cta' } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-white mb-2">CTA Flotante</h1>
           <p className="text-sm text-zinc-400">Configura el botón adhesivo para marketing o contacto instantáneo (WhatsApp/Links).</p>
        </div>
      </div>
      
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl max-w-2xl">
         <FloatingCTAForm initialData={cta || undefined} />
      </div>
    </div>
  );
}
