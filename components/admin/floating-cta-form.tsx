'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateFloatingCTA } from '@/lib/actions/floating-cta';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import { IconPicker } from './icon-picker';

interface FloatingCTAProps {
  initialData?: {
    enabled: boolean;
    label: string;
    href: string;
    position: string;
    iconName?: string | null;
    backgroundColor: string;
    textColor: string;
    openInNewTab: boolean;
  };
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="bg-orange-600 font-mono text-zinc-50 hover:bg-orange-500 w-full mt-4"
    >
      {pending ? 'ACTUALIZANDO MOTOR...' : 'GUARDAR CONFIGURACIÓN'}
    </Button>
  );
}

export function FloatingCTAForm({ initialData }: FloatingCTAProps) {
  const [icon, setIcon] = useState(initialData?.iconName || '');

  const handleAction = async (prevState: any, formData: FormData) => {
    formData.set('iconName', icon);
    return updateFloatingCTA(prevState, formData);
  };

  const [state, formAction] = useActionState(handleAction, { success: false });

  useEffect(() => {
    if (state.message) toast.success(state.message, { className: 'font-mono text-xs' });
    if (state.error) toast.error(state.error, { className: 'font-mono text-xs' });
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      
      <div className="flex items-center justify-between bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
         <div>
            <h3 className="text-white font-medium">Estado del Botón</h3>
            <p className="text-xs text-zinc-500">Apágalo si quieres ocultarlo temporalmente del sitio.</p>
         </div>
         <Switch name="enabled" defaultChecked={initialData?.enabled} className="data-[state=checked]:bg-green-500" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-400">Texto del Botón (Label)</Label>
          <Input 
            name="label" 
            defaultValue={initialData?.label || 'Escríbenos al WhatsApp'} 
            required 
            placeholder="Ej: Contáctanos"
            className="border-zinc-800 bg-zinc-950 text-white focus:border-orange-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-zinc-400">Ruta Destino (Href)</Label>
          <Input 
            name="href" 
            defaultValue={initialData?.href || 'https://wa.me/XXXXXXXXX'} 
            required 
            placeholder="https://..."
            className="border-zinc-800 bg-zinc-950 text-white focus:border-orange-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-400">Posición en Pantalla</Label>
          <select 
             name="position" 
             defaultValue={initialData?.position || 'bottom-right'} 
             className="w-full flex h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
             <option value="bottom-right">Esquina Inferior Derecha</option>
             <option value="bottom-left">Esquina Inferior Izquierda</option>
             <option value="top-right">Esquina Superior Derecha</option>
             <option value="top-left">Esquina Superior Izquierda</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-400">Ícono Representativo</Label>
          <IconPicker value={icon} onChange={setIcon} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-400">Color de Fondo (HEX)</Label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              name="backgroundColor" 
              defaultValue={initialData?.backgroundColor || '#ea580c'} 
              className="w-12 h-10 p-1 border-zinc-800 bg-zinc-950 rounded-md cursor-pointer"
            />
            <Input 
              name="backgroundColorHex" 
              defaultValue={initialData?.backgroundColor || '#ea580c'} 
              className="border-zinc-800 bg-zinc-950 text-white font-mono text-xs pointer-events-none opacity-50"
              readOnly
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-zinc-400">Color del Texto (HEX)</Label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              name="textColor" 
              defaultValue={initialData?.textColor || '#ffffff'} 
              className="w-12 h-10 p-1 border-zinc-800 bg-zinc-950 rounded-md cursor-pointer"
            />
            <Input 
              name="textColorHex" 
              defaultValue={initialData?.textColor || '#ffffff'} 
              className="border-zinc-800 bg-zinc-950 text-white font-mono text-xs pointer-events-none opacity-50"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch 
          id="openInNewTab" 
          name="openInNewTab" 
          defaultChecked={initialData?.openInNewTab ?? true} 
          className="data-[state=checked]:bg-orange-500"
        />
        <Label htmlFor="openInNewTab" className="text-zinc-300">Abrir destino en pestaña nueva segura</Label>
      </div>

      <SubmitBtn />
    </form>
  );
}
