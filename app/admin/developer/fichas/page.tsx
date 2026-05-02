import { notFound } from 'next/navigation';

export default function FichasDeveloperPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#ea580c]">Catálogo de Fichas</h1>
          <p className="text-sm text-zinc-400">Módulo de Fichas Técnicas (En desarrollo)</p>
        </div>
        <span className="text-xs font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
          DEV ONLY
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 min-h-[400px]">
        <div className="h-16 w-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6 border border-zinc-700">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2 tracking-tight">Módulo No Inicializado</h3>
        <p className="text-zinc-500 max-w-sm text-sm">
          Este submódulo para adjuntar e indexar fichas técnicas está en la cola de desarrollo. 
        </p>
      </div>
    </div>
  );
}
