import { getGlobalSettings } from '@/lib/actions/config'
import GlobalConfigForm from '@/components/admin/GlobalConfigForm'
import { validateAdminAccess } from '@/lib/admin/permissions'
import { getSession } from '@/lib/auth/get-session'

export default async function OwnerConfigPage() {
  await validateAdminAccess('OWNER')
  const initialSettings = await getGlobalSettings()
  
  // Extraemos la sesión limpia del servidor. Fallback estricto a OWNER si por casualidad
  // falla la validación en componentes secundarios para prevenir crashers.
  const session = await getSession();
  const currentRole = session?.role ?? 'OWNER';

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <h2 className="text-3xl font-black tracking-tight text-zinc-100">Configuración del Sitio</h2>
        <p className="text-zinc-400 mt-2 font-medium">
          Modifica los campos de información institucionales de tu portal B2B.
        </p>
      </div>

      <GlobalConfigForm 
        initialSettings={initialSettings} 
        role={currentRole} 
        flags={{
          allowEditContact: true,
          allowEditHero: true,
        }}
      />
    </div>
  )
}
