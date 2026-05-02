import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return { title: `Proyecto ${resolvedParams.slug} | Caso de Éxito B2B` };
}

// Static mock matching Portafolio list. Prisma implementation removed until model is created.
const getMockProject = (slug: string) => {
  return {
    id: `PRJ-${slug}`,
    title: slug === 'estructuras-de-soporte' ? 'Estructuras de Soporte' : 'Mecanizado Definitivo',
    clientName: 'Consorcio B2B',
    featuredImage: 'https://images.unsplash.com/photo-1541888087405-d14457ebddc1?q=80&w=1470&auto=format&fit=crop',
    category: 'Ingeniería Pesada',
    industry: 'Minería',
    material: 'Acero Naval',
    specs: 'Fabricación y calibración estructural.\n\nEl proyecto requirió alta precisión.'
  };
};

export default async function PortfolioProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const p = getMockProject(resolvedParams.slug);

  if (!p) {
    notFound();
  }

  return (
    <div className="bg-neutral-950 text-neutral-100 flex-1">
      <div className="bg-neutral-900 border-b border-neutral-800 pt-40 pb-16 relative mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900/90 to-neutral-800/40 z-0" />
        
        {p.featuredImage && (
           <div className="absolute inset-0 z-0 mix-blend-overlay opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
              <img src={p.featuredImage} alt="Cover" className="w-full h-full object-cover" />
           </div>
        )}

        <div className="max-w-[1320px] mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12 items-end">
          <div className="flex-1">
            <Link href="/portafolio" className="inline-flex items-center text-[var(--color-primary)] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Casos B2B
            </Link>
            <div className="flex items-center gap-3 mb-4">
              {p.category && <span className="bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-lg">{p.category}</span>}
              <span className="text-neutral-500 font-mono text-sm border border-neutral-800 px-2 py-0.5 bg-neutral-900/50">ID PROY: {p.id.substring(0,6).toUpperCase()}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">{p.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8">
              <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-widest border-b border-neutral-800 pb-4">Detalles del Requerimiento</h3>
              <div className="prose prose-invert max-w-none text-neutral-400 font-light leading-relaxed">
                {p.specs ? (
                  <div dangerouslySetInnerHTML={{ __html: p.specs.replace(/\n/g, '<br />') }} />
                ) : (
                  <p>La memoria descriptiva de este proyecto se encuentra bajo acuerdo de confidencialidad.</p>
                )}
              </div>
           </div>
           
           <div className="lg:col-span-4 space-y-4">
              <div className="bg-neutral-900 p-8 rounded-sm border border-neutral-800 shadow-xl glass">
                 <h3 className="font-bold text-lg uppercase tracking-widest border-b border-neutral-800 pb-4 mb-6 text-[var(--color-primary)]">Ficha Resumen</h3>
                 <ul className="space-y-4 text-sm">
                   <li className="flex flex-col border-b border-neutral-800/50 pb-4">
                     <span className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-1">Cliente / Mandante</span>
                     <span className="text-white font-medium">{p.clientName || 'Confidencial'}</span>
                   </li>
                   <li className="flex flex-col border-b border-neutral-800/50 pb-4">
                     <span className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-1">Industria</span>
                     <span className="text-white font-medium">{p.industry || 'Múltiple'}</span>
                   </li>
                   <li className="flex flex-col border-b border-neutral-800/50 pb-4">
                     <span className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-1">Materialidades</span>
                     <span className="text-white font-medium">{p.material || 'N/A'}</span>
                   </li>
                   <li className="flex items-center gap-2 pt-2 text-green-500 font-bold text-xs uppercase tracking-widest">
                     <CheckCircle className="w-4 h-4" />
                     Entregado Conforme
                   </li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
