import { HeroSection } from '@/components/site/hero-section';
import { ServicesSection } from '@/components/site/services-section';
import { TrustSection } from '@/components/site/trust-section';
import { getActiveServices } from '@/lib/site/get-services';
import { getSiteConfig } from '@/lib/site/get-site-config';
import { getActiveClients } from '@/lib/site/get-clients';

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const { config, activeFlags } = await getSiteConfig();
  const services = await getActiveServices();
  const { clients } = await getActiveClients();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection 
        title={config?.heroTitle || 'Excelencia Metalmecánica y Estructural'} 
        content={config?.heroSubtitle || 'Soluciones industriales de alta precisión.'}
        imageUrl={config?.heroBgUrl} 
        overline="Servicios Especializados"
      />
      
      {clients.length > 0 && (
        <TrustSection clients={clients} />
      )}

      {activeFlags.includes('capacidades') && (
        <ServicesSection 
          services={services} 
          title={config?.capabilitiesTitle || undefined}
          introText={config?.capabilitiesIntroText || undefined}
        />
      )}
    </div>
  );
}