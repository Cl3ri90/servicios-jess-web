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
    <div className="bg-[var(--site-background)] py-16 text-[var(--site-text)] flex-1">
      
      {/* Hero Section */}
      <div className="bg-[var(--site-surface-secondary)] border-b border-[var(--site-border)] py-28 mb-16 relative overflow-hidden mt-20">
        <div className="max-w-[1320px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--site-accent-soft)] border border-[var(--site-primary)]/20 text-[var(--site-primary)] text-xs font-bold uppercase tracking-widest mb-6">
            <Gavel className="w-3.5 h-3.5" />
            Marco Legal de Operaciones
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-[var(--site-text)] uppercase">
            Términos <span className="text-[var(--site-primary)]">Comerciales</span>
          </h1>
          <p className="text-xl text-[var(--site-text-muted)] max-w-2xl mx-auto font-normal leading-relaxed">
            Condiciones logísticas, garantías técnicas y marco comercial aplicable a los proyectos corporativos de {config?.name || 'nuestra maestranza'}.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6">
        <article className="bg-[var(--site-surface)] border border-[var(--site-border)] p-8 md:p-12 rounded-2xl shadow-sm mb-24">
          <div className="max-w-none">
            <div className="whitespace-pre-wrap text-[var(--site-text)] leading-relaxed font-normal text-base md:text-lg">
              {legalContent}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-[var(--site-border)] flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs text-[var(--site-text-muted)] font-mono tracking-widest uppercase">
              SISTEMA DE GESTIÓN TÉCNICA • SINGLE TENANT ARCHITECTURE
            </div>
            <div className="text-[var(--site-text-muted)] text-xs italic uppercase tracking-wider">
              Vigencia desde: {new Date().toLocaleDateString('es-CL')}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
