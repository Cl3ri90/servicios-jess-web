'use client';

import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

interface DirtySaveBtnProps {
  isDirty: boolean;
  isSaving?: boolean;
  label?: string;
  className?: string;
  form?: string;
}

export function DirtySaveBtn({ 
  isDirty, 
  isSaving, 
  label = "Guardar Configuración",
  className = "",
  form
}: DirtySaveBtnProps) {
  const { pending } = useFormStatus();
  const loading = isSaving !== undefined ? isSaving : pending;

  return (
    <div className="flex items-center gap-4">
      {isDirty && (
        <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500 animate-pulse hidden sm:block">
          • Cambios sin guardar
        </span>
      )}
      <Button
        type="submit"
        form={form}
        disabled={loading}
        className={`
          flex items-center gap-2 px-8 py-4 h-auto rounded-sm font-black uppercase tracking-widest text-xs transition-all w-full sm:w-auto
          ${isDirty 
            ? 'bg-[#ea580c] hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.25)] border-transparent' 
            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
          }
          ${className}
        `}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> 
            {label}
          </>
        )}
      </Button>
    </div>
  );
}
