'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[Admin Capacidades] Route Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm">
      <div className="mb-6 rounded-full bg-red-500/10 p-4 border border-red-500/20">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      
      <h2 className="mb-2 text-2xl font-black uppercase tracking-tighter text-white">
        Error en el Módulo de Capacidades
      </h2>
      
      <p className="mb-8 max-w-md text-sm font-mono text-zinc-400">
        Ocurrió un problema crítico al cargar esta sección. El error ha sido registrado para su revisión técnica.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
          onClick={() => reset()}
          variant="outline"
          className="flex items-center gap-2 border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs h-12 px-8"
        >
          <RefreshCcw className="h-4 w-4" />
          Reintentar Carga
        </Button>
        
        <Link href="/admin/owner">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-zinc-500 hover:text-white hover:bg-zinc-900 font-bold uppercase tracking-widest text-xs h-12 px-8"
          >
            <Home className="h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-[10px] font-mono text-zinc-600">
          ID Error: {error.digest}
        </p>
      )}
    </div>
  );
}
