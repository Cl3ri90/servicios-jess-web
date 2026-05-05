import { getSiteConfig } from '@/lib/site/get-site-config';
import type { Metadata } from 'next';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteConfig();
  return {
    title: `Portafolio B2B | ${config?.name || 'Servicios Jess'}`,
  };
}

// Temporary static array since 'Portfolio' model is not yet in Prisma Schema for this project.
const portfolios = [
  {
    id: 'PRJ-101',
    title: 'Estructuras de Soporte',
    clientName: 'Minera Norte',
    featuredImage: 'https://images.unsplash.com/photo-1541888087405-d14457ebddc1?q=80&w=1470&auto=format&fit=crop',
    category: 'Ingeniería Pesada',
    specs: 'Fabricación y calibración estructural para correas transportadoras.'
  },
  {
    id: 'PRJ-102',
    title: 'Mecanizado CNC Tolvas',
    clientName: 'Consorcio Logístico',
    featuredImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1469&auto=format&fit=crop',
    category: 'Mecanizado',
    specs: 'Reparación y mecanizado de componentes de desgaste de alto tonelaje.'
  }
];

export default async function PortafolioPage() {
  return (
    <div className="bg-neutral-950 py-16 text-neutral-100 flex-1">
      <div className="bg-neutral-900 border-b border-neutral-800 py-24 mb-16 relative mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900/80 to-neutral-800/20" />
        <div className="max-w-[1320px] mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight">
            <span className="text-[#ea580c]">Portafolio</span> Técnico
          </h1>
          <p className="text-xl font-light text-neutral-400 max-w-3xl">Casos de éxito y proyectos entregados bajo rigor normativo.</p>
        </div>
      </div>
      
      <div className="max-w-[1320px] mx-auto px-6 pb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolios.map(item => (
              <div key={item.id} className="group bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col hover:border-[var(--color-primary)]/50 transition-colors glass">
                <div className="aspect-video relative bg-neutral-950 overflow-hidden mix-blend-luminosity hover:mix-blend-normal transition-all duration-500">
                  {item.featuredImage ? (
                    <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                       <p className="text-neutral-500 font-mono text-sm">[ DATA FOTOGRÁFICA RESERVADA ]</p>
                    </div>
                  )}
                  {item.category && (
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-neutral-700 text-xs px-2 py-1 uppercase tracking-widest text-[var(--color-primary)] font-semibold">
                      {item.category}
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  {item.clientName && <p className="text-[var(--color-primary)] text-sm font-semibold tracking-wider uppercase mb-4">Cliente: {item.clientName}</p>}
                  <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6">
                    {item.specs || 'Sin especificación pública detallada.'}
                  </p>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
