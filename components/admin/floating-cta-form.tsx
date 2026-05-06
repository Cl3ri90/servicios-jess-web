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

import { LivePreviewShell } from '@/components/admin/live-preview-shell';
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn';
import { FloatingCTAClient } from '@/components/site/floating-cta-client';

export function FloatingCTAForm({ initialData }: FloatingCTAProps) {
  const [icon, setIcon] = useState(initialData?.iconName || '');

  const [formState, setFormState] = useState({
    enabled: initialData?.enabled ?? true,
    label: initialData?.label || 'Escríbenos al WhatsApp',
    href: initialData?.href || 'https://wa.me/XXXXXXXXX',
    position: initialData?.position || 'bottom-right',
    backgroundColor: initialData?.backgroundColor || '#ea580c',
    textColor: initialData?.textColor || '#ffffff',
    openInNewTab: initialData?.openInNewTab ?? true,
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const dirty = 
      formState.enabled !== (initialData?.enabled ?? true) ||
      formState.label !== (initialData?.label || 'Escríbenos al WhatsApp') ||
      formState.href !== (initialData?.href || 'https://wa.me/XXXXXXXXX') ||
      formState.position !== (initialData?.position || 'bottom-right') ||
      formState.backgroundColor !== (initialData?.backgroundColor || '#ea580c') ||
      formState.textColor !== (initialData?.textColor || '#ffffff') ||
      formState.openInNewTab !== (initialData?.openInNewTab ?? true) ||
      icon !== (initialData?.iconName || '');
    setIsDirty(dirty);
  }, [formState, icon, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormState(prev => ({ ...prev, [name]: val }));
  };

  const handleCheckedChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleAction = async (prevState: any, formData: FormData) => {
    formData.set('iconName', icon);
    // Switch sends "on" when checked, but updateFloatingCTA action handles FormData properly?
    // Let's ensure enabled and openInNewTab are added if they are in formState
    formData.set('enabled', formState.enabled ? 'on' : 'off');
    formData.set('openInNewTab', formState.openInNewTab ? 'on' : 'off');
    return updateFloatingCTA(prevState, formData);
  };

  const [state, formAction] = useActionState(handleAction, { success: false });

  useEffect(() => {
    if (state.message) {
      toast.success(state.message, { className: 'font-mono text-xs' });
      setIsDirty(false);
    }
    if (state.error) toast.error(state.error, { className: 'font-mono text-xs' });
  }, [state]);

  return (
    <div className="space-y-8">
      <LivePreviewShell title="Vista Previa: Botón Flotante" className="max-w-2xl">
         <div className="relative w-full h-[350px] bg-zinc-950 flex flex-col p-6 items-center justify-center border-t border-zinc-900/50">
            <div className="text-zinc-600 font-mono text-sm uppercase opacity-50 absolute">Simulador de Pantalla</div>
            <FloatingCTAClient config={{...formState, iconName: icon}} isPreview={true} />
         </div>
      </LivePreviewShell>

      <form action={formAction} className="space-y-6 max-w-2xl" id="floating-cta-form">
        
        <div className="flex items-center justify-between bg-zinc-950 p-4 border border-zinc-800 rounded-lg">
           <div>
              <h3 className="text-white font-medium">Estado del Botón</h3>
              <p className="text-xs text-zinc-500">Apágalo si quieres ocultarlo temporalmente del sitio.</p>
           </div>
           <Switch name="enabled" checked={formState.enabled} onCheckedChange={(v) => handleCheckedChange('enabled', v)} className="data-[state=checked]:bg-green-500" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-zinc-400">Texto del Botón (Label)</Label>
            <Input 
              name="label" 
              value={formState.label}
              onChange={handleChange}
              required 
              placeholder="Ej: Contáctanos"
              className="border-zinc-800 bg-zinc-950 text-white focus:border-orange-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-zinc-400">Ruta Destino (Href)</Label>
            <Input 
              name="href" 
              value={formState.href}
              onChange={handleChange}
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
               value={formState.position}
               onChange={handleChange as any}
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
                value={formState.backgroundColor}
                onChange={handleChange}
                className="w-12 h-10 p-1 border-zinc-800 bg-zinc-950 rounded-md cursor-pointer"
              />
              <Input 
                name="backgroundColorHex" 
                value={formState.backgroundColor}
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
                value={formState.textColor}
                onChange={handleChange}
                className="w-12 h-10 p-1 border-zinc-800 bg-zinc-950 rounded-md cursor-pointer"
              />
              <Input 
                name="textColorHex" 
                value={formState.textColor}
                className="border-zinc-800 bg-zinc-950 text-white font-mono text-xs pointer-events-none opacity-50"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2 pb-4">
          <Switch 
            id="openInNewTab" 
            name="openInNewTab" 
            checked={formState.openInNewTab}
            onCheckedChange={(v) => handleCheckedChange('openInNewTab', v)}
            className="data-[state=checked]:bg-orange-500"
          />
          <Label htmlFor="openInNewTab" className="text-zinc-300">Abrir destino en pestaña nueva segura</Label>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <DirtySaveBtn isDirty={isDirty} form="floating-cta-form" label="Guardar Configuración" />
        </div>
      </form>
    </div>
  );
}
