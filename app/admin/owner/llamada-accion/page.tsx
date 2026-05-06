import { getMainCtaConfig } from '@/lib/site/get-main-cta';
import { MainCtaForm } from '@/components/admin/main-cta-form';
import { validateAdminAccess, checkOwnerEditableFlag } from '@/lib/admin/permissions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Llamada de Acción | Portal',
};

export default async function OwnerMainCtaPage() {
  await validateAdminAccess('OWNER');
  
  const canEdit = await checkOwnerEditableFlag('cta_principal');
  if (!canEdit) {
    // Si la flag está apagada para owner o no es editable, mejor redirigir para proteger
    redirect('/admin/owner');
  }

  const config = await getMainCtaConfig();

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
          <span className="text-[#ea580c] text-3xl leading-none">/</span>
          Sección Público: CTA
        </h2>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">
          Gestiona los textos e imágenes de la sección principal
        </p>
      </div>

      <MainCtaForm initialData={config} />
    </div>
  );
}
