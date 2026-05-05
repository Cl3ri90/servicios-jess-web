'use client';

import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { toggleTechnicalSheetStatus } from '@/lib/actions/technical-sheets';
import { toast } from 'sonner';

export function TechnicalSheetsTable({ data }: { data: any[] }) {
  const handleToggle = async (id: string, current: boolean) => {
    const res = await toggleTechnicalSheetStatus(id, !current);
    if (!res.success) toast.error(res.error);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link 
          href="?add=true" 
          className="bg-orange-600 hover:bg-orange-500 text-white min-h-[44px] flex items-center px-4 py-2 rounded-md font-mono text-xs font-bold tracking-widest transition-colors w-full sm:w-auto justify-center"
        >
          + AÑADIR FICHA
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center bg-zinc-900/30 min-h-[300px]">
           <span className="text-zinc-600 font-mono text-sm uppercase mb-2">0 Fichas Técnicas</span>
           <p className="text-zinc-500 text-sm max-w-sm text-center">Todavía no has subido ningún documento técnico o PDF al ecosistema de Storage.</p>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-x-auto bg-zinc-950">
          <table className="w-full text-left text-sm text-zinc-400 min-w-max">
            <thead className="bg-zinc-900/50 border-b border-zinc-800 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-mono font-normal">Identidad del Archivo</th>
                <th className="px-6 py-4 font-mono font-normal">Tamaño</th>
                <th className="px-6 py-4 font-mono font-normal text-center">Status</th>
                <th className="px-6 py-4 font-mono font-normal text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data.map((sheet: any) => (
                <tr key={sheet.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-zinc-200">{sheet.title}</p>
                    <p className="text-xs font-mono text-zinc-500 truncate max-w-[200px]">{sheet.fileName || 'documento.pdf'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono bg-zinc-900 text-zinc-300 px-2 py-1 rounded">
                      {sheet.fileSize ? (sheet.fileSize / 1024 / 1024).toFixed(2) : '0'} MB
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch 
                      checked={sheet.isActive} 
                      onCheckedChange={() => handleToggle(sheet.id, sheet.isActive)} 
                      className="data-[state=checked]:bg-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`?edit=${sheet.id}`} 
                      className="text-orange-500 hover:text-orange-400 text-xs font-bold uppercase tracking-widest font-mono border border-orange-500/30 px-3 min-h-[44px] flex items-center justify-center rounded bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
                    >
                      EDITAR
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
