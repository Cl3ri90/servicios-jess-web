import { getCompanyInfo } from '@/lib/actions/company'
import { CompanyForm } from '@/app/admin/owner/empresa/CompanyForm'

export default async function EmpresaView({ tenantId }: { tenantId: string }) {
  const companyInfo = await getCompanyInfo(tenantId)

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Nuestra Empresa</h2>
        <p className="text-neutral-400 mt-2">Gestiona el detalle de tu maestranza, que se reflejará en la página principal y sección Empresa.</p>
      </div>

      <CompanyForm initialData={companyInfo} tenantId={tenantId} />
    </div>
  )
}
