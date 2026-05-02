import { requireOwner } from '@/lib/auth-guards'
import { requireAuthTenant } from '@/lib/tenant'
import { getAnnouncementBar } from '@/lib/actions/announcement'
import { redirect } from 'next/navigation'
import { AnnouncementBarForm } from '@/components/admin/modules/AnnouncementBarForm'

export default async function OwnerAnuncioPage() {
  const profile = await requireOwner()
  const { flags, tenantId } = await requireAuthTenant()

  if (!flags?.enableAnnouncementBar) {
    redirect('/admin/owner')
  }

  const bar = await getAnnouncementBar()

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-6">
        <h2 className="text-3xl font-black text-white">Barra de Anuncio</h2>
        <p className="text-neutral-400 mt-2 text-sm leading-relaxed">
          Configura el banner superior de tu sitio para comunicar promociones, noticias o alertas. 
          Este elemento es clave para captar la atención de tus clientes apenas ingresan al portal.
        </p>
      </div>

      <AnnouncementBarForm 
        tenantId={tenantId} 
        initialData={bar} 
      />
    </div>
  )
}
