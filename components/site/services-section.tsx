import { IndustrialCard } from '@/components/site/industrial-card';
import { SectionHeading } from '@/components/site/section-heading';

type ServiceProps = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string | null;
  icon: string | null;
};

export function ServicesSection({ services }: { services: ServiceProps[] }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="w-full bg-[var(--background)] py-32 px-6 border-y border-white/5">
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading 
          overline="CAPACIDADES TÉCNICAS" 
          title=""
          subtitle="Infraestructura tecnológica y experiencia humana para fabricar componentes, estructuras y soluciones metalmecánicas críticas." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => {
            const visualCode = `S-${String(idx + 1).padStart(2, '0')}`;
            
            return (
              <div key={svc.id}>
                <IndustrialCard 
                  id={svc.id}
                  title={svc.title}
                  description={svc.shortDescription}
                  code={visualCode}
                  imageUrl={svc.imageUrl}
                  href={`/servicios#${svc.id}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
