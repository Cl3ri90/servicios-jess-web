import { CompanyMetricsCard } from '@/components/site/company-metrics-card';

export interface EmpresaSectionProps {
  history?: string | null;
  mission?: string | null;
  vision?: string | null;
}

export function EmpresaSection({ history, mission, vision }: EmpresaSectionProps) {
  return (
    <div className="max-w-[1320px] mx-auto px-6">
       <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-16 items-start lg:items-center mb-24">
          <div className="space-y-6">
             <h2 className="text-3xl font-bold tracking-tight uppercase text-[var(--site-text)]">
                Precisión <span className="text-[var(--site-primary)] text-base align-top px-1 font-mono">/ {history ? 'HISTORIA' : '01'}</span>
             </h2>
             <p className="text-[var(--site-text-muted)] leading-relaxed font-normal text-lg sm:text-xl whitespace-pre-wrap max-w-prose">
               {history || 'En Servicios Jess no fabricamos componentes genéricos. Desarrollamos soluciones metalmecánicas críticas que soportan el núcleo de tu operación productiva. Evaluamos materiales, geometrías y tolerancias térmicas. Nuestro compromiso radica en la resiliencia operativa y la reducción radical de tiempos de inactividad para cada infraestructura.'}
             </p>
             {mission && (
               <div className="pt-4 border-t border-[var(--site-border)]">
                  <h3 className="text-xl font-bold text-[var(--site-text)] mb-2 uppercase">Misión</h3>
                  <p className="text-[var(--site-text-muted)] font-normal whitespace-pre-wrap">{mission}</p>
               </div>
             )}
             {vision && (
               <div className="pt-4 border-t border-[var(--site-border)]">
                  <h3 className="text-xl font-bold text-[var(--site-text)] mb-2 uppercase">Visión</h3>
                  <p className="text-[var(--site-text-muted)] font-normal whitespace-pre-wrap">{vision}</p>
               </div>
             )}
          </div>
          
          <CompanyMetricsCard />
       </div>
    </div>
  );
}
