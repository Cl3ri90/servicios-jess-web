import { getPlatformConfig } from '@/lib/actions/dev-platform'
import { PlatformUxForm } from './PlatformUxForm'

export default async function PlatformUXPage() {
  const config = await getPlatformConfig()

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">UX de Plataforma</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Configuración global ("Defaults") de diseño, colores y branding para nuevos tenants. 
          Los Tenants individuales crearán una copia de esta paleta al momento de registrarse.
        </p>
      </div>

      <PlatformUxForm initialData={config} />
    </div>
  )
}
