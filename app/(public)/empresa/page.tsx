import { getSiteConfig } from '@/lib/site/get-site-config';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteConfig();
  return {
    title: `Empresa B2B | ${config?.name || 'Servicios Jess'}`,
    description: config?.metaDescription || 'Conoce nuestra maestranza, capacidad productiva y rigor técnico industrial.',
  };
}

export default async function EmpresaPage() {
  const { config } = await getSiteConfig();
  const companyInfo = await prisma.companyInfo.findUnique({ where: { id: 'singleton' } }) as any;

  return (
    <div className="bg-neutral-950 py-16 text-neutral-100 flex-1">
      <div className="bg-neutral-900 border-b border-neutral-800 py-24 mb-16 relative mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900/80 to-neutral-800/20" />
        <div className="max-w-[1320px] mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-white uppercase tracking-tight">
            <span className="text-[var(--color-primary)]">Nuestra</span> Empresa
          </h1>
          <p className="text-xl font-light text-neutral-400 max-w-3xl">
            {config?.heroSubtitle || 'Más de una década resolviendo los problemas mecánicos y estructurales más complejos de la industria Chilena.'}
          </p>
        </div>
      </div>
      
      <div className="max-w-[1320px] mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
               <h2 className="text-3xl font-bold tracking-tight uppercase">Precisión <span className="text-[var(--color-primary)] text-base align-top px-1 font-mono">/ {companyInfo?.history ? 'HISTORIA' : '01'}</span></h2>
               <p className="text-neutral-400 leading-relaxed font-light text-xl whitespace-pre-wrap">
                 {companyInfo?.history || 'En Servicios Jess no fabricamos componentes genéricos. Desarrollamos soluciones metalmecánicas críticas que soportan el núcleo de tu operación productiva. Evaluamos materiales, geometrías y tolerancias térmicas. Nuestro compromiso radica en la resiliencia operativa y la reducción radical de tiempos de inactividad para cada infraestructura.'}
               </p>
               {companyInfo?.mission && (
                 <div className="pt-4 border-t border-neutral-800">
                    <h3 className="text-xl font-bold text-white mb-2 uppercase">Misión</h3>
                    <p className="text-neutral-400 font-light">{companyInfo.mission}</p>
                 </div>
               )}
               {companyInfo?.vision && (
                 <div className="pt-4 border-t border-neutral-800">
                    <h3 className="text-xl font-bold text-white mb-2 uppercase">Visión</h3>
                    <p className="text-neutral-400 font-light">{companyInfo.vision}</p>
                 </div>
               )}
            </div>
            {/* The rigid aesthetic of the dark theme image */}
            <div className="bg-neutral-900 aspect-video rounded-sm border border-neutral-800 flex items-center justify-center p-8 relative overflow-hidden group glass">
               <div className={`absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-all mix-blend-luminosity duration-500`} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1565439390117-06385d30bc98?q=80&w=2670&auto=format&fit=crop')` }}></div>
               <div className="absolute inset-0 bg-neutral-950/40"></div>
               {companyInfo?.values && (
                 <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                    <h4 className="text-white font-bold tracking-widest text-sm uppercase mb-2">Valores</h4>
                    <p className="text-[var(--color-primary)] font-mono text-xs">{companyInfo.values}</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
