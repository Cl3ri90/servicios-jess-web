import { getSiteConfig } from '@/lib/site/get-site-config';
import type { Metadata } from 'next';
import { PortfolioCard } from '@/components/site/portfolio-card';
import { prisma } from '@/lib/db/prisma';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteConfig();
  return {
    title: `Portafolio B2B | ${config?.name || 'Servicios Jess'}`,
  };
}

export default async function PortafolioPage() {
  const portfolios = await prisma.portfolio.findMany({
    where: { isDeleted: false, isPublished: true },
    orderBy: { sortOrder: 'asc' }
  });

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
         {portfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 min-h-[300px]">
              <span className="text-zinc-500 font-mono text-lg">Aún no hay proyectos publicados.</span>
            </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portfolios.map(item => (
                <PortfolioCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  clientName={item.showClientName ? (item.publicClientName || item.clientName) : null}
                  featuredImage={item.coverImageUrl || item.featuredImage}
                  category={item.category || item.industry}
                  specs={item.shortDescription || item.specs}
                  pieceType={item.pieceType}
                  material={item.material}
                />
              ))}
           </div>
         )}
      </div>
    </div>
  );
}
