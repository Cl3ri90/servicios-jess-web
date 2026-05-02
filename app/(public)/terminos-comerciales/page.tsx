import { getSiteConfig } from '@/lib/site/get-site-config';
import type { Metadata } from 'next';
import { Gavel } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteConfig();
  return {
    title: `Términos Comerciales | ${config?.name || 'Servicios Jess'}`,
    description: `Consulta nuestros términos y condiciones comerciales para servicios industriales.`,
  };
}

export default async function TermsPage() {
  const { config } = await getSiteConfig();
  
  const legalContent = config?.legalTerms || 'Nuestros manuales de operación, garantías técnicas y términos comerciales aplicables se encuentran actualmente en auditoría legal. Al finalizar la actualización normativa B2B, los publicaremos íntegramente en esta sección.';

  return (
    <div className="bg-neutral-950 py-16 text-neutral-100 selection:bg-[var(--color-primary)]/30 flex-1">
      
      {/* Hero Section */}
      <div className="bg-neutral-900 border-b border-neutral-800 py-32 mb-16 relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-[#000000] bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900/80 to-neutral-800/20" />
        
        <div className="max-w-[1320px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest mb-6 glass">
            <Gavel className="w-3.5 h-3.5" />
            Marco Legal de Operaciones
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white uppercase">
            Términos <span className="text-[var(--color-primary)]">Comerciales</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Condiciones logísticas, garantías técnicas y marco comercial aplicable a los proyectos corporativos de {config?.name || 'nuestra maestranza'}.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6">
        <article className="bg-neutral-900/50 border border-neutral-800 p-8 md:p-12 rounded-sm shadow-2xl glass mb-24">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-neutral-300 leading-relaxed font-light text-lg">
              {legalContent}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs text-neutral-500 font-mono tracking-widest uppercase">
              SISTEMA DE GESTIÓN TÉCNICA • SINGLE TENANT ARCHITECTURE
            </div>
            <div className="text-neutral-400 text-xs italic uppercase tracking-wider">
              Vigencia desde: {new Date().toLocaleDateString('es-CL')}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
