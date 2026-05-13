import { Users, Inbox, MessageSquare, CheckCircle, XCircle, Timer } from 'lucide-react';

interface KpiGridProps {
  metrics: {
    visits: number;
    new: number;
    contacted: number;
    resolved: number;
    lost: number;
    avgResponseTimeMs: number;
    pendingResponseCount: number;
  };
}

export function KpiGrid({ metrics }: KpiGridProps) {
  const formatTime = (ms: number) => {
    if (ms === 0) return '---';
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes} min`;
  };

  const kpis = [
    { label: 'Visitas', value: metrics.visits.toLocaleString(), icon: Users, color: 'text-zinc-400' },
    { label: 'Leads Nuevos', value: metrics.new, icon: Inbox, color: 'text-white', highlight: metrics.new > 0 },
    { label: 'Contactados', value: metrics.contacted, icon: MessageSquare, color: 'text-[#ea580c]' },
    { label: 'Resueltos', value: metrics.resolved, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Perdidos', value: metrics.lost, icon: XCircle, color: 'text-zinc-600' },
    { label: 'T. Resp. Prom.', value: formatTime(metrics.avgResponseTimeMs), icon: Timer, color: 'text-zinc-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, i) => (
        <div key={i} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            {kpi.highlight && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#ea580c] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ea580c]"></span>
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-white">{kpi.value}</div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{kpi.label}</div>
          <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <kpi.icon className="w-12 h-12 text-white" />
          </div>
        </div>
      ))}
    </div>
  );
}
