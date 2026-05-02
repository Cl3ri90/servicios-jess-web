import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  // Need to find by ID since we don't have slug on serviceCapability yet. We'll use ID assuming the slug URL is /servicios/:id.
  const srv = await prisma.serviceCapability.findFirst({ where: { id: resolvedParams.slug } }).catch(() => null);
  
  if (!srv) return { title: 'Servicio no encontrado | Servicios Jess SpA' };
  return { title: `${srv.title} | Especialidades B2B` };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const srv = await prisma.serviceCapability.findFirst({
    where: { id: resolvedParams.slug }
  }).catch(() => null);

  if (!srv || !srv.isActive) {
    notFound();
  }

  return (
    <div className="bg-neutral-950 text-neutral-100 flex-1">
      <div className="bg-neutral-900 border-b border-neutral-800 pt-32 pb-16 relative mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900/80 to-transparent z-0" />
        
        {srv.imageUrl && (
           <div className="absolute inset-0 z-0 mix-blend-overlay opacity-20 filter grayscale">
              <img src={srv.imageUrl} alt="Cover" className="w-full h-full object-cover" />
           </div>
        )}

        <div className="max-w-[1320px] mx-auto px-6 relative z-10 pt-16">
          <Link href="/servicios" className="inline-flex items-center text-[var(--color-primary)] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Capacidades Técnicas
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">{srv.title}</h1>
          <p className="text-xl font-light text-neutral-400 max-w-3xl leading-relaxed">
            {srv.shortDescription}
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8">
              <div className="prose prose-invert max-w-none text-neutral-300">
                {srv.description ? (
                  <div dangerouslySetInnerHTML={{ __html: srv.description.replace(/\n/g, '<br />') }} />
                ) : (
                  <p className="text-neutral-500 font-light italic">No public technical specification available for this procedure yet.</p>
                )}
              </div>
           </div>
           
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-neutral-900/50 p-8 rounded-sm border border-neutral-800 shadow-xl glass">
                 <h3 className="font-bold text-lg uppercase tracking-widest border-b border-neutral-800 pb-4 mb-6 text-white">Ingeniería Respaldo</h3>
                 
                 <p className="text-xs text-neutral-500 font-light mb-4">Esta capacidad no cuenta con un dossier PDF público. Solicite especificaciones directas vía correo corporativo.</p>
                 
                 <div className="mt-6 pt-6 border-t border-neutral-800">
                    <Link href="/contacto" className="block text-center w-full border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-bold py-3 px-4 transition-all uppercase tracking-wider text-sm rounded-sm">
                      Cotizar Proyecto Relacionado
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
