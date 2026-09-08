import { HeroSection } from '@/components/site/hero-section';
import { PublicKpiSection } from '@/components/site/public-kpi-section';
import { PublicTrustSection } from '@/components/site/public-trust-section';
import { PublicServicesSection } from '@/components/site/public-services-section';
import { PublicMainCtaSection } from '@/components/site/public-main-cta-section';
import { getSiteConfig } from '@/lib/site/get-site-config';
import { prisma } from '@/lib/db/prisma';

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const { config } = await getSiteConfig();

  const activeModules = await prisma.featureFlag.findMany({
    where: { isActive: true, publicVisible: true },
    orderBy: { publicOrder: 'asc' }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection 
        title={config?.heroTitle || 'Gomas Industriales & Plásticos'}
        content={config?.heroSubtitle || 'Fábrica de gomas industriales, plásticos de ingeniería y maestranza.'}
        imageUrl={config?.heroBgUrl} 
        overline="Servicios Especializados"
        btnText={config?.heroBtnText || 'Cotizar proyecto'}
        btnLink={config?.heroBtnLink || '/contacto'}
        secBtnText={config?.heroSecBtnText || 'Ver capacidades'}
        secBtnLink={config?.heroSecBtnLink || '/servicios'}
      />
      
      {activeModules.map(module => {
        switch(module.key) {
          case 'indicadores': return <PublicKpiSection key={module.key} />;
          case 'trust': return <PublicTrustSection key={module.key} />;
          case 'capacidades': return <PublicServicesSection key={module.key} />;
          case 'cta_principal': return <PublicMainCtaSection key={module.key} />;
          default: return null;
        }
      })}
    </div>
  );
}