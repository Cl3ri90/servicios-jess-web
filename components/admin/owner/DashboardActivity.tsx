import { Inbox, Mail, CheckCircle, XCircle, MessageSquare, ArrowRight, UserPlus } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  date: Date;
  iconType: string;
}

interface ActivityProps {
  activities: ActivityItem[];
}

function formatRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  if (minutes > 0) return `hace ${minutes}m`;
  return 'ahora';
}

export function DashboardActivity({ activities }: ActivityProps) {
  const getIcon = (item: ActivityItem) => {
    if (item.type === 'EMAIL') {
      return item.iconType === 'INBOUND' ? <Mail className="w-3.5 h-3.5 text-[#ea580c]" /> : <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />;
    }
    
    switch (item.iconType) {
      case 'CREATED': return <UserPlus className="w-3.5 h-3.5 text-blue-400" />;
      case 'WON': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'LOST': return <XCircle className="w-3.5 h-3.5 text-zinc-600" />;
      case 'CONTACTED': return <MessageSquare className="w-3.5 h-3.5 text-[#ea580c]" />;
      default: return <Inbox className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Actividad Reciente</h3>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-10 text-zinc-600 text-xs italic uppercase tracking-widest">
            Sin actividad reciente en este período
          </div>
        ) : (
          activities.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                {getIcon(item)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-bold text-white truncate uppercase tracking-tight">{item.title}</h4>
                  <span className="text-[9px] font-mono text-zinc-600 whitespace-nowrap">
                    {formatRelativeTime(item.date)}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <button className="w-full py-2 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all">
          Ver todo el historial
        </button>
      </div>
    </div>
  );
}
