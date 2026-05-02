'use client';

import { useActionState, useEffect } from 'react';
import { updateDeveloperConfig } from '@/lib/actions/developer-config';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

interface DeveloperConfigFormProps {
  initialData: {
    name: string;
    primaryColor: string;
    metaTitle: string;
    isMaintenance: boolean;
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="bg-orange-600 font-mono text-zinc-50 hover:bg-orange-500 hover:shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all"
    >
      {pending ? 'EJECUTANDO...' : 'GUARDAR_CONFIGURACION'}
    </Button>
  );
}

export function DeveloperConfigForm({ initialData }: DeveloperConfigFormProps) {
  const [state, formAction] = useActionState(updateDeveloperConfig, { success: false, message: '' });

  useEffect(() => {
    if (state.message) toast.success(state.message, { className: 'font-mono text-xs' });
    if (state.error) toast.error(state.error, { className: 'font-mono text-xs' });
  }, [state]);

  return (
    <form action={formAction} className="space-y-8 bg-zinc-900/40 p-6 border border-zinc-800 rounded-lg">
      <div className="space-y-4">
        <h3 className="text-lg font-mono text-orange-500 mb-4">// BRANDING CENTRAL</h3>
        
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-zinc-400 font-mono text-xs">name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={initialData.name} 
            className="border-zinc-800 bg-zinc-950 focus:border-orange-500 font-mono text-primary"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="primaryColor" className="text-zinc-400 font-mono text-xs">primaryColor (HEX)</Label>
          <Input 
            id="primaryColor" 
            name="primaryColor" 
            defaultValue={initialData.primaryColor} 
            className="border-zinc-800 bg-zinc-950 focus:border-orange-500 font-mono text-orange-500"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="metaTitle" className="text-zinc-400 font-mono text-xs">metaTitle global</Label>
          <Input 
            id="metaTitle" 
            name="metaTitle" 
            defaultValue={initialData.metaTitle} 
            className="border-zinc-800 bg-zinc-950 focus:border-orange-500 font-mono text-zinc-200"
          />
        </div>
      </div>

      <div className="h-px w-full bg-zinc-800" />

      <div className="space-y-4">
        <h3 className="text-lg font-mono text-orange-500 mb-4">// SWITCHES DE SISTEMA</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="isMaintenance" className="text-zinc-400 font-mono text-xs">isMaintenance_mode</Label>
          {/* Workaround for Switch input form passing: use hidden input or Switch primitive */}
          <Switch id="isMaintenance" name="isMaintenance" defaultChecked={initialData.isMaintenance} />
        </div>
      </div>

      <div className="flex justify-start">
        <SubmitButton />
      </div>
    </form>
  );
}
