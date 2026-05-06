import { getMainCtaConfig } from '@/lib/site/get-main-cta';
import { MainCtaForm } from '@/components/admin/main-cta-form';

export const metadata = {
  title: 'Configuración de CTA Principal | Admin',
};

export default async function DeveloperMainCtaPage() {
  const config = await getMainCtaConfig();

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
          <span className="text-[#ea580c] text-3xl leading-none">/</span>
          Llamada de Acción (CTA Principal)
        </h2>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">
          Gestiona la sección principal de conversión en el sitio público
        </p>
      </div>

      <MainCtaForm initialData={config} />
    </div>
  );
}
