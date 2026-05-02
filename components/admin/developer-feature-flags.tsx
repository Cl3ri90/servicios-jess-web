'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface DeveloperFeatureFlagsProps {
  initialFlags: {
    enableSeoManager: boolean;
    enablePromoBanner: boolean;
    enableCatalog: boolean;
  };
}

export function DeveloperFeatureFlags({ initialFlags }: DeveloperFeatureFlagsProps) {
  const [flags, setFlags] = useState(initialFlags);

  const handleToggle = async (key: keyof typeof flags) => {
    const nextState = { ...flags, [key]: !flags[key] };
    setFlags(nextState);

    toast.success('Regla de negocio alterada exitosamente.', {
      description: `El módulo ha sido ${nextState[key] ? 'habilitado' : 'retirado'} del core.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between rounded-lg border border-white/5 p-4 bg-white/5">
        <div className="space-y-0.5 mt-0">
          <Label className="text-base text-white">SEO Manager Avanzado</Label>
          <p className="text-sm text-zinc-400">Inyecta un motor de inyección de Metadatos personalizables por página.</p>
        </div>
        <Switch 
          checked={flags.enableSeoManager} 
          onCheckedChange={() => handleToggle('enableSeoManager')} 
        />
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border border-white/5 p-4 bg-white/5">
        <div className="space-y-0.5 mt-0">
          <Label className="text-base text-white">Banner Promocional Flotante</Label>
          <p className="text-sm text-zinc-400">Habilita una barra de anuncios en el topo del /layout público.</p>
        </div>
        <Switch 
          checked={flags.enablePromoBanner} 
          onCheckedChange={() => handleToggle('enablePromoBanner')} 
        />
      </div>

       <div className="flex flex-row items-center justify-between rounded-lg border border-white/5 p-4 bg-white/5">
        <div className="space-y-0.5 mt-0">
          <Label className="text-base text-white">Fichas de Exposición</Label>
          <p className="text-sm text-zinc-400">Activa grilla dinámica de catálogo y su sub-ruta pública respectiva.</p>
        </div>
        <Switch 
          checked={flags.enableCatalog} 
          onCheckedChange={() => handleToggle('enableCatalog')} 
        />
      </div>
    </div>
  );
}
