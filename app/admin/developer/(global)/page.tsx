import { getTenantsList } from '@/lib/actions/dev-tenant'
import { TenantListClient } from './TenantListClient'

export default async function DeveloperPanel() {
  const tenants = await getTenantsList()

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestión SaaS & Tenants</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Nivel de Acceso: Desarrollador (Developer). Aquí puedes administrar los clientes suscritos y prender/apagar módulos globalmente.</p>
      </div>

      <TenantListClient initialTenants={tenants} />
    </div>
  )
}
