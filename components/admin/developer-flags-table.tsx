'use client';

import { useState } from 'react';
import { updateFeatureFlag } from '@/lib/actions/feature-flags';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type Flag = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isActive: boolean;
  ownerVisible: boolean;
  ownerEditable: boolean;
  publicVisible: boolean;
  category?: string;
};

const CATEGORIES = [
  'Owner CMS',
  'Frontend Público',
  'Developer Tools',
  'Marketing / Conversiones',
  'Sistema'
];

export function DeveloperFlagsTable({ initialFlags }: { initialFlags: Flag[] }) {
  const [flags, setFlags] = useState<Flag[]>(initialFlags);
  const [activeTab, setActiveTab] = useState<string>('Owner CMS');

  const handleToggle = async (key: string, field: 'isActive' | 'ownerVisible' | 'ownerEditable' | 'publicVisible', currentValue: boolean) => {
    // UI Optimista
    setFlags(prev => prev.map(f => f.key === key ? { ...f, [field]: !currentValue } : f));

    const res = await updateFeatureFlag({ key, field, value: !currentValue });
    
    if (res.success) {
      toast.success(`Switch de ${key} actualizado.`, { className: 'font-mono text-xs' });
    } else {
      // Revertir
      setFlags(prev => prev.map(f => f.key === key ? { ...f, [field]: currentValue } : f));
      toast.error(res.error || 'Error actualizando flag', { className: 'font-mono text-xs' });
    }
  };

  const filteredFlags = flags.filter(f => f.category === activeTab);

  return (
    <div className="space-y-6">
      {/* Sistema manual de TABS para asegurar diseño ordenado sin instalar dependencias */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-2 border-b border-zinc-800 pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 min-h-[44px] text-sm font-semibold rounded-t-lg transition-colors border-b-2 shrink-0 ${
              activeTab === cat 
                ? 'border-orange-500 text-orange-500 bg-zinc-900/50' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredFlags.length === 0 ? (
         <div className="border border-dashed border-zinc-800 rounded-xl p-12 flex items-center justify-center bg-zinc-950/50">
            <p className="text-zinc-500 font-mono text-sm uppercase">Módulos pendientes de configuración técnica</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFlags.map(flag => {
               const isDisabled = !flag.isActive;
               return (
                 <div key={flag.key} className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 transition-all hover:border-zinc-700 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[var(--color-primary)]">
                           {flag.name}
                         </h3>
                         <p className="font-mono text-xs text-zinc-500 mt-1 select-all">{flag.key}</p>
                       </div>
                       <div className="flex justify-center items-center h-8">
                         <span className={`text-[10px] uppercase font-black tracking-widest mr-3 ${flag.isActive ? 'text-green-500' : 'text-zinc-600'}`}>
                           {flag.isActive ? 'MOTOR EN CÉNIT' : 'APAGADO_'}
                         </span>
                         <Switch 
                           checked={flag.isActive} 
                           onCheckedChange={() => handleToggle(flag.key, 'isActive', flag.isActive)} 
                           className="data-[state=checked]:bg-green-500"
                         />
                       </div>
                    </div>
                    
                    <p className="text-sm text-zinc-400 mb-6 font-light">{flag.description || 'Configuración subyacente.'}</p>
                    
                    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
                       <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Switches de Sub-Ruteo</h4>
                       <div className="space-y-4">
                          <div className={`flex justify-between items-center transition-opacity ${isDisabled ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                             <p className="text-sm text-zinc-300 font-medium">Visible en Owner Panel</p>
                             <Switch 
                               checked={flag.ownerVisible} 
                               disabled={isDisabled}
                               onCheckedChange={() => handleToggle(flag.key, 'ownerVisible', flag.ownerVisible)} 
                               className="data-[state=checked]:bg-[#ea580c]"
                             />
                          </div>
                          
                          <div className={`flex justify-between items-center transition-opacity ${isDisabled ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                             <p className="text-sm text-zinc-300 font-medium">Editable por Owner</p>
                             <Switch 
                               checked={flag.ownerEditable} 
                               disabled={isDisabled}
                               onCheckedChange={() => handleToggle(flag.key, 'ownerEditable', flag.ownerEditable)} 
                               className="data-[state=checked]:bg-purple-500"
                             />
                          </div>

                          <div className={`flex justify-between items-center transition-opacity ${isDisabled ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                             <p className="text-sm text-zinc-300 font-medium">Renderizar Público (Frontend)</p>
                             <Switch 
                               checked={flag.publicVisible} 
                               disabled={isDisabled}
                               onCheckedChange={() => handleToggle(flag.key, 'publicVisible', flag.publicVisible)} 
                               className="data-[state=checked]:bg-[#ea580c]"
                             />
                          </div>
                       </div>
                    </div>
                 </div>
               );
            })}
         </div>
      )}
    </div>
  );
}
