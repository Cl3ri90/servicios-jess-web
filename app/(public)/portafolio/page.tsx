import { getSiteConfig } from '@/lib/site/get-site-config';
import type { Metadata } from 'next';
import { PortfolioCard } from '@/components/site/portfolio-card';

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
              <PortfolioCard 
                key={item.id}
                id={item.id}
                title={item.title}
                clientName={item.clientName}
                featuredImage={item.featuredImage}
                category={item.category}
                specs={item.specs}
              />
            ))}
         </div>
      </div>
    </div>
  );
}
