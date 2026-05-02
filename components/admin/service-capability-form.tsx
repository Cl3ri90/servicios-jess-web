'use client';

import { useActionState, useEffect, useState } from 'react';
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

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="bg-orange-600 font-mono text-zinc-50 hover:bg-orange-500 w-full"
    >
      {pending ? 'PROCESANDO...' : 'GUARDAR SERVICIO'}
    </Button>
  );
}

export function ServiceCapabilityForm({ initialData, onSuccess }: CapabilityFormProps) {
  const [icon, setIcon] = useState(initialData?.iconName || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  
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

  return (
    <form action={formAction} className="space-y-4 relative">
      {isUploading && (
        <div className="absolute inset-0 z-50 rounded bg-zinc-950/80 flex items-center justify-center">
            <span className="text-orange-500 font-mono text-xs">Subiendo imagen...</span>
        </div>
      )}
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="imageUrl" defaultValue={initialData?.imageUrl || ''} />
      
      <div className="grid gap-2">
        <Label className="text-zinc-400">Título</Label>
        <Input 
          name="title" 
          defaultValue={initialData?.title} 
          required 
          className="border-zinc-800 bg-zinc-950 focus:border-orange-500 text-white"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-zinc-400">Descripción Corta</Label>
        <Input 
          name="shortDescription" 
          defaultValue={initialData?.shortDescription} 
          required 
          className="border-zinc-800 bg-zinc-950 focus:border-orange-500 text-white"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-zinc-400">Descripción Detallada</Label>
        <textarea 
          name="description" 
          defaultValue={initialData?.description} 
          required 
          className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
           <Label className="text-zinc-400">Ícono Representativo</Label>
           <IconPicker value={icon} onChange={setIcon} />
        </div>
        
        <div className="grid gap-2">
           <Label className="text-zinc-400">Imagen de Fondo (Opcional)</Label>
           {initialData?.imageUrl && (
             <div className="text-[10px] bg-zinc-900 border-zinc-800 p-1 flex items-center gap-2 rounded border truncate w-full text-zinc-400 inline-block px-2">
               Imagen existente
             </div>
           )}
           <Input 
             type="file" 
             name="file" 
             accept="image/*"
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

      <div className="pt-4 flex gap-2 w-full">
        <SubmitBtn />
        {initialData?.id && (
           <Button 
             type="button" 
             variant="destructive"
             disabled={isDeleting}
             onClick={handleDelete}
             className="px-3"
             title="Eliminar este servicio"
           >
             🗑
           </Button>
        )}
      </div>
    </form>
  );
}
