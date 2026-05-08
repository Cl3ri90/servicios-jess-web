'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateCapabilitiesHeader } from '@/lib/actions/service-capabilities';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LivePreviewShell } from '@/components/admin/live-preview-shell';
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn';
import { SectionHeading } from '@/components/site/section-heading';

interface CapabilitiesHeaderFormProps {
  initialData: {
    title: string;
    introText: string;
  };
}

export function CapabilitiesHeaderForm({ initialData }: CapabilitiesHeaderFormProps) {
  const [formState, setFormState] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setIsDirty(
      formState.title !== initialData.title || 
      formState.introText !== initialData.introText
    );
  }, [formState, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [state, formAction] = useActionState(updateCapabilitiesHeader, { success: false });

  useEffect(() => {
    if (state.message) {
      toast.success(state.message, { className: 'font-mono text-xs' });
      setIsDirty(false);
    }
    if (state.error) toast.error(state.error, { className: 'font-mono text-xs' });
  }, [state]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start mb-12">
      <div className="min-w-0">
        <form 
          action={formAction} 
          className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 w-full min-w-0 space-y-6" 
          id="capabilities-header-form"
        >
          <div className="border-b border-zinc-800 pb-2">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c]">
              Texto de Sección Pública
            </h3>
          </div>

          <div className="grid gap-2">
            <Label className="text-zinc-400">Título de Sección</Label>
            <Input 
              name="title" 
              value={formState.title}
              onChange={handleChange}
              required 
              className="border-zinc-800 bg-zinc-950 focus:border-orange-500 text-white font-bold"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-zinc-400">Texto Introductorio</Label>
            <textarea 
              name="introText" 
              value={formState.introText}
              onChange={handleChange}
              rows={3}
              required 
              className="flex min-h-[100px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y"
            />
          </div>

          <div className="pt-4 flex justify-end border-t border-zinc-800">
            <DirtySaveBtn isDirty={isDirty} form="capabilities-header-form" label="Guardar Textos" />
          </div>
        </form>
      </div>

      <div className="lg:sticky lg:top-24">
        <LivePreviewShell title="Preview: Cabecera de Sección" className="mb-0">
           <div className="p-8 bg-neutral-950 flex flex-col justify-center min-h-[300px]">
             <SectionHeading 
               overline={formState.title} 
               title=""
               subtitle={formState.introText} 
             />
           </div>
        </LivePreviewShell>
      </div>
    </div>
  );
}
