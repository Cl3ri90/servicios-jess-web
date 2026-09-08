import { getSiteConfig } from '@/lib/site/get-site-config';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { EmpresaSection } from '@/components/site/empresa-section';

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
    <div className="bg-[var(--site-background)] py-16 text-[var(--site-text)] flex-1">
      <div className="bg-[var(--site-surface-secondary)] border-b border-[var(--site-border)] py-24 mb-16 relative mt-16 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-[var(--site-text)] uppercase tracking-tight">
            <span className="text-[var(--site-primary)]">Nuestra</span> Empresa
          </h1>
          <p className="text-xl font-normal text-[var(--site-text-muted)] max-w-3xl">
            {config?.heroSubtitle || 'Más de una década resolviendo los problemas mecánicos y estructurales más complejos de la industria Chilena.'}
          </p>
        </div>
      </div>
      
      <EmpresaSection 
        history={companyInfo?.history}
        mission={companyInfo?.mission}
        vision={companyInfo?.vision}
      />
    </div>
  );
}
