'use client';

import { useActionState, useEffect } from 'react';
import { updateOwnerConfig } from '@/lib/actions/owner-config';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

interface OwnerSiteFormProps {
  initialData: {
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    heroTitle: string;
    heroSubtitle: string;
  };
  isReadOnly?: boolean;
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending || disabled} 
      className="bg-white font-mono text-zinc-950 hover:bg-zinc-200 transition-all font-semibold"
    >
      {pending ? 'PROCESANDO...' : 'ACTUALIZAR DATOS'}
    </Button>
  );
}

export function OwnerSiteForm({ initialData, isReadOnly }: OwnerSiteFormProps) {
  const [state, formAction] = useActionState(updateOwnerConfig, { success: false });

  useEffect(() => {
    if (state.message) toast.success(state.message, { className: 'font-mono text-xs' });
    if (state.error) toast.error(state.error, { className: 'font-mono text-xs' });
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-2">Información de Contacto</h3>
        <div className="grid gap-2">
          <Label htmlFor="contactEmail" className="text-zinc-400">Email Oficial</Label>
          <Input 
            id="contactEmail" 
            name="contactEmail" 
            type="email" 
            defaultValue={initialData.contactEmail} 
            disabled={isReadOnly}
            className="border-zinc-800 bg-zinc-950 focus:border-zinc-500 text-white"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contactPhone" className="text-zinc-400">Teléfono Operativo</Label>
          <Input 
            id="contactPhone" 
            name="contactPhone" 
            type="tel" 
            defaultValue={initialData.contactPhone} 
            disabled={isReadOnly}
            className="border-zinc-800 bg-zinc-950 focus:border-zinc-500 text-white"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contactAddress" className="text-zinc-400">Dirección Física</Label>
          <Input 
            id="contactAddress" 
            name="contactAddress" 
            defaultValue={initialData.contactAddress} 
            disabled={isReadOnly}
            className="border-zinc-800 bg-zinc-950 focus:border-zinc-500 text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-2">Identidad Pública (Hero)</h3>
        <div className="grid gap-2">
          <Label htmlFor="heroTitle" className="text-zinc-400">Título Principal (H1)</Label>
          <Input 
            id="heroTitle" 
            name="heroTitle" 
            defaultValue={initialData.heroTitle} 
            disabled={isReadOnly}
            className="border-zinc-800 bg-zinc-950 focus:border-zinc-500 text-white"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="heroSubtitle" className="text-zinc-400">Mensaje de Apoyo (Subtítulo)</Label>
          <Input 
            id="heroSubtitle" 
            name="heroSubtitle" 
            defaultValue={initialData.heroSubtitle} 
            disabled={isReadOnly}
            className="border-zinc-800 bg-zinc-950 focus:border-zinc-500 text-white"
          />
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex justify-end pt-4">
          <SubmitButton disabled={isReadOnly} />
        </div>
      )}
    </form>
  );
}
