import { prisma } from '@/lib/prisma';
import { validateAdminAccess } from '@/lib/admin/permissions';
import { CompanyInfoForm } from '@/components/admin/company-info-form';

export const dynamic = 'force-dynamic';

export default async function DeveloperCompanyPage() {
  await validateAdminAccess('DEVELOPER');

  const config = await prisma.companyInfo.findUnique({
    where: { id: 'singleton' }
  });

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
           <h2 className="text-3xl font-black text-white flex items-center gap-2">
             Identidad Empresa
             <span className="text-xs font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
                DEV ONLY
             </span>
           </h2>
           <p className="text-neutral-400 mt-1 text-sm">Configura la narrativa institucional general de la empresa.</p>
        </div>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
         <CompanyInfoForm initialData={config} />
      </div>
    </div>
  );
}
