'use client';

import { useActionState, useEffect } from 'react';
import { upsertCompanyInfo } from '@/lib/actions/company-info';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="bg-orange-600 font-mono text-zinc-50 hover:bg-orange-500 py-3 px-6 rounded w-full md:w-auto mt-4 transition-colors font-bold uppercase tracking-widest text-xs"
    >
      {pending ? 'Procesando...' : 'Guardar Información'}
    </button>
  );
}

export function CompanyInfoForm({ initialData }: { initialData: any }) {
  const initialState: any = { success: false, message: '', error: '' };
  const [state, formAction] = useActionState(upsertCompanyInfo as any, initialState);

  useEffect(() => {
    if (state.message) toast.success(state.message);
    if (state.error) toast.error(state.error);
  }, [state]);

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 min-h-[100px]";

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
         <Label className="text-zinc-400 font-mono">Historia</Label>
         <textarea name="history" className={inputClass} defaultValue={initialData?.history || ''} placeholder="En el año 19..." />
      </div>
      <div className="space-y-2">
         <Label className="text-zinc-400 font-mono">Misión</Label>
         <textarea name="mission" className={inputClass} defaultValue={initialData?.mission || ''} placeholder="Proveer soluciones..." />
      </div>
      <div className="space-y-2">
         <Label className="text-zinc-400 font-mono">Visión</Label>
         <textarea name="vision" className={inputClass} defaultValue={initialData?.vision || ''} placeholder="Ser líderes en..." />
      </div>
      <div className="space-y-2">
         <Label className="text-zinc-400 font-mono">Valores (JSON string, lista separada por comas, etc)</Label>
         <textarea name="values" className={`${inputClass} min-h-[60px]`} defaultValue={initialData?.values || ''} placeholder="Calidad, Seguridad, Eficiencia" />
      </div>

      <SubmitBtn />
    </form>
  )
}
