import { HeroSection } from '@/components/site/hero-section';
import { ServicesSection } from '@/components/site/services-section';
import { IndustrialCTA } from '@/components/site/industrial-cta';
import { getActiveServices } from '@/lib/site/get-services';
import { getSiteConfig } from '@/lib/site/get-site-config';



export default async function PublicHomePage() {
  // 1. Buscamos la configuración de Servicios Jess en la DB
  const { config, activeFlags } = await getSiteConfig();
  const services = await getActiveServices();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Llamamos a TU componente HeroSection con la data dinámica */}
      <HeroSection 
        title={config?.heroTitle || 'Excelencia Metalmecánica y Estructural'} 
        content={config?.heroSubtitle || 'Soluciones industriales de alta precisión.'}
        // Pasamos la URL de Supabase que guardamos en el admin
        imageUrl={config?.heroBgUrl} 
        overline="Servicios Especializados"
      />
      {activeFlags.includes('capacidades') && (
        <ServicesSection services={services} />
      )}

      {/* Controlamos si el CTA se muestra o no según el Admin usando Feature Flags */}
      {activeFlags.includes('cta_flotante') && (
        <IndustrialCTA />
      )}
    </div>
  );
}