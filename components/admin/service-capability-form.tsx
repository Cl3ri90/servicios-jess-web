'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { deleteServiceCapability, upsertServiceCapability } from '@/lib/actions/service-capabilities';
import { uploadImage } from '@/lib/actions/upload';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { IconPicker } from './icon-picker';
import { useFormStatus } from 'react-dom';

interface CapabilityFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    shortDescription: string;
    imageUrl?: string | null;
    iconName?: string | null;
    order: number;
    isActive: boolean;
  };
  onSuccess?: () => void;
}

import { LivePreviewShell } from '@/components/admin/live-preview-shell';
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn';
import { IndustrialCard } from '@/components/site/industrial-card';
import { RichTextEditor } from './rich-text-editor';
import { RichTextContent } from '@/components/shared/rich-text-content';

export function ServiceCapabilityForm({ initialData, onSuccess }: CapabilityFormProps) {
  const [icon, setIcon] = useState(initialData?.iconName || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  
  const [formState, setFormState] = useState({
    title: initialData?.title || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const dirty = 
      formState.title !== (initialData?.title || '') ||
      formState.shortDescription !== (initialData?.shortDescription || '') ||
      formState.description !== (initialData?.description || '') ||
      formState.imageUrl !== (initialData?.imageUrl || '') ||
      icon !== (initialData?.iconName || '');
    setIsDirty(dirty);
  }, [formState, icon, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleAction = async (prevState: any, formData: FormData) => {
     // Si hay un archivo válido, lo subimos
     const file = formData.get('file') as File;
     if (file && file.size > 0) {
       setIsUploading(true);
       const upRes = await uploadImage(formData);
       setIsUploading(false);
       if (upRes.error) {
         return { success: false, error: upRes.error };
       }
       if (upRes.url) {
         formData.set('imageUrl', upRes.url); // insertamos el URL resultante
         setFormState(prev => ({ ...prev, imageUrl: upRes.url as string }));
       }
     }
     
     // Borramos file para no enviarlo sucio a la base de validación
     formData.delete('file');
     formData.set('iconName', icon);
     
     return upsertServiceCapability(prevState, formData);
  };

  const [state, formAction] = useActionState(handleAction, { success: false });

  useEffect(() => {
    if (state.message) {
      toast.success(state.message, { className: 'font-mono text-xs' });
      setIsDirty(false);
      if (onSuccess) onSuccess();
    }
    if (state.error) toast.error(state.error, { className: 'font-mono text-xs' });
  }, [state, onSuccess]);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('¿Seguro que deseas eliminar este servicio definitivamente?')) return;
    
    setIsDeleting(true);
    const res = await deleteServiceCapability(initialData.id);
    setIsDeleting(false);
    if (res.success) {
       toast.success('Servicio eliminado');
       // redirigir o limpiar limpiando la query params via window.location.href ?
       window.location.href = '?';
    } else {
       toast.error(res.error || 'Error borrando', { className: 'font-mono text-xs' });
    }
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Si estamos editando y acabamos de montar, hacer scroll suave al form
    if (initialData?.id && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [initialData?.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start max-w-full">
      <div className="min-w-0">
        <form action={formAction} className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 w-full min-w-0 space-y-4 relative" id="capability-form" ref={formRef}>
          <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c]">
              {initialData?.id ? 'Editar Capacidad' : 'Registrar Nueva Capacidad'}
            </h3>
            {initialData?.id && (
              <a href="?" className="text-xs font-mono text-zinc-500 hover:text-zinc-300">
                [X] CERRAR
              </a>
            )}
          </div>

        {isUploading && (
          <div className="absolute inset-0 z-50 rounded bg-zinc-950/80 flex items-center justify-center">
              <span className="text-orange-500 font-mono text-xs">Subiendo imagen...</span>
          </div>
        )}
        {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
        <input type="hidden" name="imageUrl" value={formState.imageUrl} />
        
        <div className="grid gap-2">
          <Label className="text-zinc-400">Título</Label>
          <Input 
            name="title" 
            value={formState.title}
            onChange={handleChange}
            required 
            className="border-zinc-800 bg-zinc-950 focus:border-orange-500 text-white"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-zinc-400">Descripción Corta</Label>
          <Input 
            name="shortDescription" 
            value={formState.shortDescription}
            onChange={handleChange}
            required 
            className="border-zinc-800 bg-zinc-950 focus:border-orange-500 text-white"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-zinc-400">Descripción Detallada (Enriquecida)</Label>
          <input type="hidden" name="description" value={formState.description} />
          <RichTextEditor 
            value={formState.description}
            onChange={(val) => setFormState(prev => ({ ...prev, description: val }))}
            placeholder="Describe detalladamente esta capacidad técnica..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
             <Label className="text-zinc-400">Ícono Representativo</Label>
             <IconPicker value={icon} onChange={setIcon} />
          </div>
          
          <div className="grid gap-2">
             <Label className="text-zinc-400">Imagen de Fondo (Opcional)</Label>
             {formState.imageUrl && (
               <div className="text-[10px] bg-zinc-900 border-zinc-800 p-1 flex items-center gap-2 rounded border truncate w-full text-zinc-400 inline-block px-2">
                 Imagen existente
               </div>
             )}
             <Input 
               type="file" 
               name="file" 
               accept="image/*"
               onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormState(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
                  }
               }}
               className="border-zinc-800 bg-zinc-950 text-white text-xs cursor-pointer file:cursor-pointer file:bg-zinc-800 file:text-zinc-300 file:border-0 file:me-4 file:h-full file:px-3 hover:file:bg-zinc-700" 
             />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label className="text-zinc-400">Orden</Label>
            <Input 
              name="order" 
              type="number" 
              defaultValue={initialData?.order ?? 0} 
              className="border-zinc-800 bg-zinc-950 text-white"
            />
          </div>
          
          <div className="flex flex-col gap-2 justify-center pt-5">
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                name="isActive" 
                defaultChecked={initialData?.isActive ?? true} 
              />
              <Label htmlFor="isActive" className="text-zinc-400">Público</Label>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full border-t border-zinc-800 mt-4">
          <DirtySaveBtn isDirty={isDirty} form="capability-form" className="w-full sm:w-auto" label="Guardar Capacidad" />
          {initialData?.id && (
             <Button 
               type="button" 
               variant="destructive"
               disabled={isDeleting}
               onClick={handleDelete}
               className="px-3 w-full sm:w-auto"
               title="Eliminar este servicio"
             >
               🗑 Eliminar
             </Button>
          )}
        </div>
      </form>
      </div>

      {/* Sandbox Preview */}
      <div className="min-w-0 lg:sticky lg:top-24">
        <LivePreviewShell title="Sandbox: Ficha de Capacidad" className="mb-0">
           <div className="p-6 bg-zinc-950 flex justify-center min-h-[450px]">
            <div className="flex flex-col gap-6 w-full max-w-[320px]">
               <IndustrialCard 
                 id="preview"
                 title={formState.title || 'Título Capacidad'}
                 description={formState.shortDescription || 'Breve descripción de la capacidad...'}
                 imageUrl={formState.imageUrl}
                 iconName={icon}
                 href="#"
               />
               <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-sm">
                 <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">Contenido Expandido (Vista Admin)</p>
                 <RichTextContent html={formState.description} className="prose-sm" />
               </div>
            </div>
           </div>
        </LivePreviewShell>
      </div>
    </div>
  );
}
