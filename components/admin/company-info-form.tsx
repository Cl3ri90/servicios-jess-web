'use client';

import { useActionState, useEffect, useState } from 'react';
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

import { LivePreviewShell } from '@/components/admin/live-preview-shell';
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn';
import { EmpresaSection } from '@/components/site/empresa-section';

export function CompanyInfoForm({ initialData }: { initialData: any }) {
  const initialState: any = { success: false, message: '', error: '' };
  const [state, formAction] = useActionState(upsertCompanyInfo as any, initialState);

  const [formState, setFormState] = useState({
    history: initialData?.history || '',
    mission: initialData?.mission || '',
    vision: initialData?.vision || '',
    values: initialData?.values || ''
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const dirty = 
      formState.history !== (initialData?.history || '') ||
      formState.mission !== (initialData?.mission || '') ||
      formState.vision !== (initialData?.vision || '') ||
      formState.values !== (initialData?.values || '');
    setIsDirty(dirty);
  }, [formState, initialData]);

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
      setIsDirty(false); // Reset dirty on save
    }
    if (state.error) toast.error(state.error);
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 min-h-[100px]";

  return (
    <div className="space-y-12">
      <LivePreviewShell title="Vista Previa: Sección Empresa">
        <div className="transform scale-[0.6] sm:scale-75 origin-top-left sm:origin-top min-h-[500px]">
          <EmpresaSection 
            history={formState.history}
            mission={formState.mission}
            vision={formState.vision}
          />
        </div>
      </LivePreviewShell>

      <form action={formAction} className="space-y-6 max-w-4xl">
        <div className="space-y-2">
           <Label className="text-zinc-400 font-mono">Historia / Resumen</Label>
           <textarea name="history" className={inputClass} value={formState.history} onChange={handleChange} placeholder="En el año 19..." />
        </div>
        <div className="space-y-2">
           <Label className="text-zinc-400 font-mono">Misión</Label>
           <textarea name="mission" className={inputClass} value={formState.mission} onChange={handleChange} placeholder="Proveer soluciones..." />
        </div>
        <div className="space-y-2">
           <Label className="text-zinc-400 font-mono">Visión</Label>
           <textarea name="vision" className={inputClass} value={formState.vision} onChange={handleChange} placeholder="Ser líderes en..." />
        </div>
        <div className="space-y-2">
           <Label className="text-zinc-400 font-mono">Valores (Opcional)</Label>
           <textarea name="values" className={`${inputClass} min-h-[60px]`} value={formState.values} onChange={handleChange} placeholder="Calidad, Seguridad, Eficiencia" />
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <DirtySaveBtn isDirty={isDirty} />
        </div>
      </form>
    </div>
  )
}
