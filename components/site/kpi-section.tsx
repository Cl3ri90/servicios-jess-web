import { KpiCard } from './kpi-card';

interface KpiSectionProps {
  metrics: { id: string; value: string; label: string; description?: string | null }[];
}

export function KpiSection({ metrics }: KpiSectionProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className="py-10 lg:py-12 relative overflow-hidden z-10">
      {/* Background ambient glow - Subdued */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ea580c]/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <h2 className="sr-only">Indicadores de la empresa</h2>

        <div className={`grid gap-4 md:gap-6 ${
          metrics.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          metrics.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
          metrics.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {metrics.map(m => (
            <KpiCard 
              key={m.id}
              value={m.value}
              label={m.label}
              description={m.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
