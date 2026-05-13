interface FunnelProps {
  metrics: {
    totalLeads: number;
    new: number;
    contacted: number;
    resolved: number;
    lost: number;
    closureRate: number;
    lossRate: number;
  };
}

export function CommercialFunnel({ metrics }: FunnelProps) {
  const { totalLeads, new: n, contacted, resolved, lost } = metrics;

  const stages = [
    { label: 'Ingresados (Total)', value: totalLeads, color: 'bg-zinc-800', width: 'w-full', percent: 100 },
    { label: 'Nuevos / Pendientes', value: n, color: 'bg-zinc-700', width: `${totalLeads > 0 ? (n / totalLeads) * 100 : 0}%`, percent: totalLeads > 0 ? Math.round((n / totalLeads) * 100) : 0 },
    { label: 'En Gestión (Contactados)', value: contacted, color: 'bg-[#ea580c]', width: `${totalLeads > 0 ? (contacted / totalLeads) * 100 : 0}%`, percent: totalLeads > 0 ? Math.round((contacted / totalLeads) * 100) : 0 },
    { label: 'Resueltos (Éxito)', value: resolved, color: 'bg-emerald-600', width: `${totalLeads > 0 ? (resolved / totalLeads) * 100 : 0}%`, percent: totalLeads > 0 ? Math.round((resolved / totalLeads) * 100) : 0 },
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Embudo Comercial</h3>
        <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest">
          Tasa Cierre: {metrics.closureRate.toFixed(1)}%
        </div>
      </div>

      <div className="space-y-6">
        {totalLeads === 0 ? (
          <div className="h-40 flex items-center justify-center text-zinc-600 text-xs italic uppercase tracking-widest border border-dashed border-zinc-800 rounded-lg">
            Sin datos suficientes para el embudo
          </div>
        ) : (
          stages.map((stage, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-zinc-400">{stage.label}</span>
                <span className="text-white">{stage.value} <span className="text-zinc-600 ml-1">({stage.percent}%)</span></span>
              </div>
              <div className="h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className={`h-full ${stage.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(234,88,12,0.1)]`}
                  style={{ width: stage.width }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center">
        <div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Leads Perdidos</div>
          <div className="text-xl font-black text-zinc-400">{lost}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Tasa Pérdida</div>
          <div className="text-lg font-black text-red-900/50">{metrics.lossRate.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
