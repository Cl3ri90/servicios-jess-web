'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { upsertTechnicalSheet, deleteTechnicalSheet } from '@/lib/actions/technical-sheets';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="bg-orange-600 font-mono text-zinc-50 hover:bg-orange-500 flex-1"
    >
      {pending ? 'SUBIENDO BINARIOS...' : 'GUARDAR FICHA'}
    </Button>
  );
}

export function TechnicalSheetForm({ initialData }: { initialData?: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (prevState: any, formData: FormData) => {
    return upsertTechnicalSheet(prevState, formData);
  };

  const [state, formAction] = useActionState(handleAction, { success: false });

  useEffect(() => {
    if (state.message) {
      toast.success(state.message, { className: 'font-mono text-xs' });
      window.location.href = '?';
    }
    if (state.error) toast.error(state.error, { className: 'font-mono text-xs' });
  }, [state]);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('¿Seguro que deseas eliminar esta Ficha permanentemente?')) return;
    
    setIsDeleting(true);
    const res = await deleteTechnicalSheet(initialData.id);
    setIsDeleting(false);
    if (res.success) {
       toast.success('Ficha eliminada');
       window.location.href = '?';
    } else {
       toast.error(res.error || 'Error borrando', { className: 'font-mono text-xs' });
    }
  };

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
         <h3 className="font-semibold text-white text-lg">{initialData ? 'Editor de PDF' : 'Nueva Ficha Técnica'}</h3>
         <Link href="?" className="text-xs font-mono text-zinc-500 hover:text-orange-500 uppercase">
           [X] Cancelar
         </Link>
      </div>

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="existingFileUrl" value={initialData?.fileUrl || ''} />
      <input type="hidden" name="existingFileName" value={initialData?.fileName || ''} />
      <input type="hidden" name="existingFileType" value={initialData?.fileType || ''} />
      <input type="hidden" name="existingFileSize" value={initialData?.fileSize || '0'} />
      <input type="hidden" name="existingCoverUrl" value={initialData?.coverImageUrl || ''} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-400">Título Formal</Label>
          <Input 
            name="title" 
            defaultValue={initialData?.title} 
            required 
            placeholder="Ej: Ficha de Especificaciones K-9..."
            className="border-zinc-800 bg-zinc-950 text-white focus:border-orange-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-zinc-400">Categoría (Opcional)</Label>
          <Input 
            name="category" 
            defaultValue={initialData?.category} 
            placeholder="Ej: Motores, Sensores..."
            className="border-zinc-800 bg-zinc-950 text-white focus:border-orange-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-400">Descripción Corta</Label>
        <textarea 
          name="description" 
          defaultValue={initialData?.description} 
          maxLength={300}
          className="flex min-h-[60px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 border border-zinc-800 bg-zinc-950 p-4 rounded-lg">
        <div className="space-y-2">
           <Label className="text-zinc-400 font-bold flex items-center gap-2">
             Archivo PDF <span className={initialData?.fileUrl ? "text-green-500 text-xs" : "text-red-500 text-xs"}>{initialData?.fileUrl ? 'Cargado' : '*Requerido'}</span>
           </Label>
           {initialData?.fileName && (
              <p className="text-[10px] text-zinc-500 font-mono truncate">{initialData.fileName} ({(initialData.fileSize / 1024 / 1024).toFixed(2)} MB)</p>
           )}
           <Input 
             type="file" 
             name="file" 
             accept="application/pdf"
             className="border-zinc-800 bg-zinc-900 text-white text-xs cursor-pointer file:bg-zinc-800 file:text-zinc-300 file:border-0 hover:file:bg-zinc-700" 
           />
           <p className="text-[10px] uppercase text-zinc-600 font-mono">Max 20MB</p>
        </div>

        <div className="space-y-2">
           <Label className="text-zinc-400 font-bold flex items-center gap-2">
             Portada (Opcional) <span className="text-zinc-600 text-xs text-mono">JPEG/PNG</span>
           </Label>
           <Input 
             type="file" 
             name="coverFile" 
             accept="image/*"
             className="border-zinc-800 bg-zinc-900 text-white text-xs cursor-pointer file:bg-zinc-800 file:text-zinc-300 file:border-0 hover:file:bg-zinc-700" 
           />
        </div>
      </div>

      <div className="flex gap-6 items-center pt-2">
         <div className="flex items-center space-x-2">
            <Switch 
              id="isActive" 
              name="isActive" 
              defaultChecked={initialData?.isActive ?? true} 
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="isActive" className="text-zinc-300">Publicado</Label>
         </div>

         <div className="space-y-2 flex-1">
            <Label className="text-zinc-400 sr-only">Orden Numérico</Label>
            <div className="flex items-center gap-2 max-w-xs">
              <span className="text-xs font-mono text-zinc-500">Orden:</span>
              <Input 
                name="order" 
                type="number"
                defaultValue={initialData?.order || 0} 
                className="border-zinc-800 bg-zinc-950 text-white h-8"
              />
            </div>
         </div>
      </div>

      <div className="flex gap-2 w-full pt-4 border-t border-zinc-800">
         <SubmitBtn />
         {initialData?.id && (
           <Button 
             type="button" 
             variant="destructive"
             disabled={isDeleting}
             onClick={handleDelete}
             title="Eliminar PDF"
             className="px-6"
           >
             {isDeleting ? '🗑...' : '🗑'}
           </Button>
         )}
      </div>
    </form>
  );
}
