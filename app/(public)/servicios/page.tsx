import Link from 'next/link';
import { getActiveServices } from '@/lib/site/get-services';
import { getSiteConfig } from '@/lib/site/get-site-config';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteConfig();
  return {
    title: `Capacidades Técnicas | ${config?.name || 'Servicios Jess'}`,
  };
}

export default async function ServiciosPage() {
  const { config } = await getSiteConfig();
  const servicios = await getActiveServices() as any[];

  return (
    <div className="bg-neutral-950 py-16 text-neutral-100 selection:bg-[var(--color-primary)]/30 flex-1">
      <div className="bg-neutral-900 border-b border-neutral-800 py-24 mb-16 relative mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900/80 to-neutral-800/20" />
        <div className="max-w-[1320px] mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight">
            <span className="text-[var(--color-primary)]">Servicios</span> Industriales
          </h1>
          <p className="text-xl font-light text-neutral-400 max-w-3xl">
            {config?.heroSubtitle || 'Desarrollo y mantenimiento metalmecánico para minería, forestal y agroindustria.'}
          </p>
        </div>
      </div>
      
      <div className="max-w-[1320px] mx-auto px-6 pb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((srv) => (
              <Link href={`/servicios`} key={srv.id} className="group bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden flex flex-col hover:border-[var(--color-primary)]/50 transition-colors glass">
                <div className="aspect-video relative bg-neutral-950 overflow-hidden mix-blend-luminosity hover:mix-blend-normal transition-all duration-500">
                  {srv.imageUrl ? (
                    <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale contrast-125 brightness-75 group-hover:brightness-100 group-hover:grayscale-0" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                       <span className="w-16 h-1 bg-neutral-800 block mb-4 relative overflow-hidden">
                         <span className="absolute left-0 top-0 h-full w-1/3 bg-[var(--color-primary)]"></span>
                       </span>
                       <p className="text-neutral-500 font-mono text-sm">[ IMAGEN PENDIENTE ]</p>
                    </div>
                  )}
                  {srv.iconName && (
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-neutral-700 text-neutral-400 p-2 rounded w-10 h-10 flex flex-col justify-center items-center">
                       <span className="font-mono text-xs">{srv.iconName.slice(0,2).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-neutral-700 text-xs px-2 py-1 uppercase tracking-widest text-[var(--color-primary)] font-semibold">
                    TECH-SPEC
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6">
                    {srv.shortDescription || 'Requerimiento técnico personalizado.'}
                  </p>
                  <div className="flex items-center text-[var(--color-primary)] font-semibold uppercase text-xs tracking-wider gap-2 mt-auto hover:gap-3 transition-all">
                    Ver Especificación <span className="text-lg">→</span>
                  </div>
                </div>
              </Link>
            ))}
            {servicios.length === 0 && (
              <div className="col-span-12 text-center py-24 text-neutral-500 font-light border border-dashed border-neutral-800 rounded-sm">
                 No hay servicios activos en este momento.
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
