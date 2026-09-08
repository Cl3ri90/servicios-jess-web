import React from 'react';
import { getActiveServices } from '@/lib/site/get-services';
import { getSiteConfig } from '@/lib/site/get-site-config';
import type { Metadata } from 'next';
import { DynamicIcon } from '@/components/shared/dynamic-icon';

export const dynamic = "force-dynamic";

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
    <div className="bg-[var(--site-background)] py-16 text-[var(--site-text)] flex-1">
      <div className="bg-[var(--site-surface-secondary)] border-b border-[var(--site-border)] py-24 mb-16 relative mt-20 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[var(--site-text)] uppercase tracking-tight">
            <span className="text-[var(--site-primary)]">Servicios</span> Industriales
          </h1>
          <p className="text-xl font-normal text-[var(--site-text-muted)] max-w-3xl">
            {config?.heroSubtitle || 'Desarrollo y mantenimiento metalmecánico para minería, forestal y agroindustria.'}
          </p>
        </div>
      </div>
      
      <div className="max-w-[1320px] mx-auto px-6 pb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((srv) => (
              <div key={srv.id} className="group bg-[var(--site-surface)] border border-[var(--site-border)] rounded-2xl overflow-hidden flex flex-col hover:border-[var(--site-primary)] hover:shadow-md transition-all">
                <div className="aspect-video relative bg-[var(--site-surface-secondary)] overflow-hidden">
                  {srv.imageUrl ? (
                    <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                       <span className="w-16 h-1 bg-neutral-800 block mb-4 relative overflow-hidden">
                         <span className="absolute left-0 top-0 h-full w-1/3 bg-[var(--site-primary)]"></span>
                       </span>
                       <p className="text-[var(--site-text-muted)] font-mono text-sm">[ IMAGEN PENDIENTE ]</p>
                    </div>
                  )}
                  {srv.iconName && (
                    <div className="absolute top-4 left-4 bg-[var(--site-surface)]/90 backdrop-blur-sm border border-[var(--site-border)] text-[var(--site-primary)] p-2 rounded-lg w-10 h-10 flex flex-col justify-center items-center shadow-sm">
                       <DynamicIcon 
                        icon={srv.iconName} 
                        className="w-5 h-5"
                        colorMode={srv.iconName.includes(':') && !srv.iconName.startsWith('lucide:') && !srv.iconName.startsWith('mdi:') ? 'native' : 'mono'}
                       />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1 text-left">
                  <h3 className="text-xl font-bold text-[var(--site-text)] mb-3 group-hover:text-[var(--site-primary)] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-[var(--site-text-muted)] text-sm font-normal leading-relaxed mb-6 flex-1">
                    {srv.shortDescription || 'Requerimiento técnico personalizado.'}
                  </p>
                </div>
              </div>
            ))}
            {servicios.length === 0 && (
              <div className="col-span-12 text-center py-24 text-[var(--site-text-muted)] font-light border border-dashed border-[var(--site-border)] rounded-lg">
                 No hay servicios activos en este momento.
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
