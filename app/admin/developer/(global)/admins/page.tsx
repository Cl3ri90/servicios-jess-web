import { getGlobalAdmins } from '@/lib/actions/dev-admins'
import { AdminsClient } from './AdminsClient'
import { requireDeveloper } from '@/lib/auth-guards'

export default async function AdminsGlobalPage() {
  const currentDev = await requireDeveloper()
  const admins = await getGlobalAdmins()

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Administradores Globales</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Gestiona el acceso de los Super Administradores al panel Developer entero. Se necesita de al menos un administrador operativo siempre.</p>
      </div>
      
      <AdminsClient initialAdmins={admins} currentUserId={currentDev.id} />
    </div>
  )
}
