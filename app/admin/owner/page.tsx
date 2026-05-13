import { getCurrentProfile } from "@/lib/db/profile";
import { getOwnerDashboardData, DashboardRange } from "@/lib/analytics/owner-dashboard";
import { TimeRangePicker } from "@/components/admin/owner/TimeRangePicker";
import { KpiGrid } from "@/components/admin/owner/KpiGrid";
import { CommercialFunnel } from "@/components/admin/owner/CommercialFunnel";
import { DashboardActivity } from "@/components/admin/owner/DashboardActivity";
import { TrendingUp, MousePointer2 } from 'lucide-react';

export default async function OwnerDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const profile = await getCurrentProfile();
  const params = await searchParams;
  const range = (params.range as DashboardRange) || '30d';
  
  const { metrics, activity } = await getOwnerDashboardData(range);

  return (
    <div className="space-y-8 max-w-[1400px] mb-20 animate-in fade-in duration-500">
      
      {/* Executive Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#ea580c]" />
            <span className="text-[10px] font-black text-[#ea580c] uppercase tracking-[0.3em]">Executive Overview</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Resumen <span className="text-[#ea580c] not-italic">General</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-sm font-medium">
            Bienvenido, {profile?.email?.split('@')[0] || 'Owner'}. Monitoreo de tracción comercial y operativa.
          </p>
        </div>
        
        <TimeRangePicker />
      </header>

      {/* KPI Section */}
      <section>
        <KpiGrid metrics={metrics} />
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Funnel Column */}
        <div className="lg:col-span-7 space-y-8">
          <CommercialFunnel metrics={metrics} />
          
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Tráfico del Sitio</h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <MousePointer2 className="w-3 h-3" />
                Interacciones en tiempo real
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Visitas Totales</div>
                <div className="text-2xl font-black text-white">{metrics.visits.toLocaleString()}</div>
                <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ea580c] w-2/3 opacity-50" />
                </div>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Leads Pendientes</div>
                <div className="text-2xl font-black text-[#ea580c]">{metrics.pendingResponseCount}</div>
                <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ea580c] w-1/3" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[#ea580c]/5 border border-[#ea580c]/10 rounded-xl">
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                * Las métricas de tráfico se basan en el registro de sesiones únicas y eventos de navegación capturados por el sistema de analytics interno.
              </p>
            </div>
          </div>
        </div>

        {/* Activity Column */}
        <div className="lg:col-span-5">
          <DashboardActivity activities={activity} />
        </div>

      </div>

    </div>
  );
}
