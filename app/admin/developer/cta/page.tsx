import { notFound } from 'next/navigation';

export default function CtaDeveloperPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#ea580c]">Botón Flotante CTA</h1>
          <p className="text-sm text-zinc-400">Configuración global del Call to Action (En desarrollo)</p>
        </div>
        <span className="text-xs font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
          DEV ONLY
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 min-h-[400px]">
        <div className="h-16 w-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6 border border-zinc-700">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2 tracking-tight">Módulo Pendiente</h3>
        <p className="text-zinc-500 max-w-sm text-sm">
          Este módulo administrará las conversiones rápidas (WhatsApp/Link) desde un botón flotante.
        </p>
      </div>
    </div>
  );
}
