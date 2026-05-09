import { KpiCard } from './kpi-card';

interface KpiSectionProps {
  metrics: { id: string; value: string; label: string; description?: string | null }[];
}

export function KpiSection({ metrics }: KpiSectionProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className="py-24 bg-neutral-950 border-y border-neutral-900 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ea580c]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
            Indicadores <span className="text-[#ea580c]">Operativos</span>
          </h2>
          <p className="text-neutral-500 mt-2 font-light tracking-wide">
            Métricas de rendimiento y capacidad instalada B2B.
          </p>
        </div>

        <div className={`grid gap-6 ${
          metrics.length === 1 ? 'grid-cols-1 max-w-md' :
          metrics.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl' :
          metrics.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
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
