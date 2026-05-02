import { checkOwnerAccess } from '@/lib/admin/permissions';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TechnicalSheetsTable } from '@/components/admin/technical-sheets-table';
import { TechnicalSheetForm } from '@/components/admin/technical-sheet-form';

export const dynamic = 'force-dynamic';

export default async function TechnicalSheetsDeveloperPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string, add?: string }>;
}) {
  // Aseguramos que solo el DEVELOPER entra aca, pero extrañaremos la key config si fuesemos owner.
  // Seguiremos usando el wrapper seguro.
  const { flag } = await checkOwnerAccess('fichas_tecnicas', 'DEVELOPER');
  if (!flag) notFound();

  const sp = await searchParams;
  
  const sheets = await prisma.technicalSheet.findMany({
    orderBy: { order: 'asc' }
  });

  const activeSheet = sp.edit ? sheets.find((s: any) => s.id === sp.edit) : undefined;
  const showForm = sp.add === 'true' || !!activeSheet;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{flag.name}</h1>
           <p className="text-sm text-zinc-400">Publica catálogos o archivos PDF oficiales para uso interno o público.</p>
        </div>
      </div>
      
      {showForm ? (
         <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative max-w-3xl">
            <TechnicalSheetForm initialData={activeSheet} />
         </div>
      ) : (
         <TechnicalSheetsTable data={sheets} />
      )}
    </div>
  );
}
