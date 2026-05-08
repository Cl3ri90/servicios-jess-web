import * as Icons from 'lucide-react';

interface AnalyticsData {
  todayVisits: number;
  todayUniqueVisitors: number;
  last7DaysVisits: number;
  topPages: { path: string; count: number }[];
  recentEvents: any[];
  ctaClicks: number;
  leadCount: number;
  conversionRate: number;
  mostVisitedPage: string;
  mostClickedCta: string;
  bounceRate: number;
  bouncedSessions: number;
  engagedSessions: number;
  totalSessions: number;
  dailyVisits: { date: string; visits: number }[];
}

const numberFormatter = new Intl.NumberFormat("es-CL");
const percentFormatter = new Intl.NumberFormat("es-CL", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const maxVisits = Math.max(...data.dailyVisits.map(d => d.visits), 1);

  return (
    <div className="space-y-8">
      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard 
          title="Visitantes Hoy" 
          value={numberFormatter.format(data.todayUniqueVisitors)} 
          sub={`${numberFormatter.format(data.todayVisits)} Vistas Totales`}
          icon={Icons.Users}
        />
        <MetricCard 
          title="Conversión" 
          value={percentFormatter.format(data.conversionRate)} 
          sub={`${numberFormatter.format(data.leadCount)} Leads Totales`}
          icon={Icons.Target}
        />
        <MetricCard 
          title="Tasa de Rebote" 
          value={percentFormatter.format(data.bounceRate)} 
          sub={`${numberFormatter.format(data.bouncedSessions)} Rebotados / ${numberFormatter.format(data.totalSessions)} Total`}
          icon={Icons.LogOut}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras Simple */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Icons.TrendingUp className="w-4 h-4 text-[#ea580c]" />
            Tráfico Últimos 7 Días
          </h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {data.dailyVisits.map((day, idx) => {
              const height = (day.visits / maxVisits) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-zinc-800 group-hover:bg-[#ea580c] transition-all rounded-t-sm relative"
                      style={{ height: `${height}%` }}
                    >
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         {day.visits}
                       </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Páginas */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Icons.Layers className="w-4 h-4 text-orange-500" />
            Páginas más Visitadas
          </h3>
          <div className="space-y-3">
            {data.topPages.length > 0 ? data.topPages.map((page, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg">
                <span className="text-xs font-mono text-zinc-300 truncate max-w-[200px]">{page.path}</span>
                <span className="text-xs font-black text-white bg-zinc-800 px-2 py-1 rounded">{numberFormatter.format(page.count)}</span>
              </div>
            )) : (
              <p className="text-xs text-zinc-500 text-center py-4">Sin datos registrados.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calidad de Sesión */}
        <div className="lg:col-span-1 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
           <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Icons.Activity className="w-4 h-4 text-green-500" />
              Calidad de Sesión
            </h3>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 mb-1">
                     <span>Sesiones Comprometidas</span>
                     <span className="text-white">{numberFormatter.format(data.engagedSessions)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500" style={{ width: `${data.totalSessions > 0 ? (data.engagedSessions/data.totalSessions)*100 : 0}%` }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 mb-1">
                     <span>Rebotes</span>
                     <span className="text-white">{numberFormatter.format(data.bouncedSessions)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                     <div className="h-full bg-red-500" style={{ width: `${data.totalSessions > 0 ? (data.bouncedSessions/data.totalSessions)*100 : 0}%` }}></div>
                  </div>
               </div>
            </div>
           </div>
           <div className="mt-6 pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
              * Calculado en base a sesiones únicas en los últimos 30 días.
           </div>
        </div>

        {/* Eventos Recientes */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Icons.List className="w-4 h-4 text-purple-500" />
            Interacciones Recientes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-zinc-500 uppercase border-b border-zinc-800">
                  <th className="pb-3 pr-4">Tipo</th>
                  <th className="pb-3 pr-4">Etiqueta</th>
                  <th className="pb-3 pr-4">Ruta</th>
                  <th className="pb-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {data.recentEvents.length > 0 ? data.recentEvents.map((event, idx) => (
                  <tr key={idx} className="text-zinc-300">
                    <td className="py-3 pr-4 font-bold text-[#ea580c]">{event.type}</td>
                    <td className="py-3 pr-4">{event.label || '-'}</td>
                    <td className="py-3 pr-4 truncate max-w-[150px]">{event.path || '-'}</td>
                    <td className="py-3 text-zinc-500">{new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-zinc-600">No hay interacciones registradas aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon }: any) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800 p-5 rounded-2xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-zinc-800 rounded-lg">
          <Icon className="w-4 h-4 text-[#ea580c]" />
        </div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</p>
      </div>
      <h3 className="text-3xl font-black text-white font-mono">{value}</h3>
      <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-tighter">{sub}</p>
    </div>
  );
}
