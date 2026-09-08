import { IndustrialCard } from '@/components/site/industrial-card';

type ServiceProps = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string | null;
  iconName: string | null;
};

export function ServicesSection({ 
  services,
  title = "Capacidades Técnicas",
  introText = "Somos especialistas en soluciones para gomas industriales, plásticos de ingeniería y servicios de maestranza. Nos destaca la experiencia técnica, calidad de fabricación y compromiso."
}: { 
  services: ServiceProps[];
  title?: string;
  introText?: string;
}) {
  if (!services || services.length === 0) return null;

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 px-6 lg:px-8">
      <div className="max-w-[1320px] mx-auto">

        {/* Encabezado de Sección: Título a la izquierda con barra naranja, texto introductorio a la derecha */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-[var(--site-primary)] text-3xl font-black leading-none select-none">/</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--site-text)] tracking-tight">
              {title}
            </h2>
          </div>
          {introText && (
            <p className="text-xs sm:text-sm text-[var(--site-text-muted)] max-w-xl lg:text-right leading-relaxed">
              {introText}
            </p>
          )}
        </div>

        {/* Grilla responsiva adaptada a la cantidad real: 4 en desktop, 2 en tablet, 1 en móvil */}
        <div className={`grid gap-6 ${
          services.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          services.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' :
          services.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {services.map((svc) => (
            <div key={svc.id}>
              <IndustrialCard
                id={svc.id}
                title={svc.title}
                description={svc.shortDescription}
                imageUrl={svc.imageUrl}
                iconName={svc.iconName}
                colorOnHover={true}
                href="/servicios"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
