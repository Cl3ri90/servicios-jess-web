import { requireOwner } from '@/lib/auth-guards'
import { requireAuthTenant } from '@/lib/tenant'
import { getDocumentsForOwner } from '@/lib/actions/documents'
import { DescargasClient } from './DescargasClient'
import { redirect } from 'next/navigation'

export default async function OwnerDescargasPage() {
  await requireOwner()
  const { flags } = await requireAuthTenant()

  if (!(flags as any)?.enableTechnicalDownloads) redirect('/admin/owner')

  const docs = await getDocumentsForOwner()

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-neutral-800 pb-4">
        <h2 className="text-3xl font-black text-white">Fichas Técnicas y Documentos</h2>
        <p className="text-neutral-400 mt-1 text-sm">
          Gestiona los documentos descargables que aparecerán en la sección de Servicios. 
          Sube el archivo a Supabase Storage y pega aquí la URL pública.
        </p>
      </div>

      <div className="mb-6 bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-sm text-neutral-400 flex gap-3">
        <span className="text-blue-400 shrink-0">ℹ️</span>
        <div>
          <p className="font-medium text-neutral-200 mb-1">Cómo subir archivos</p>
          <p>Sube el PDF o documento a <strong className="text-white">Supabase Storage</strong> (bucket público) y copia la URL que genera. Pega esa URL en el campo "URL del archivo" al crear el documento.</p>
        </div>
      </div>

      <DescargasClient initialDocs={docs as any[]} />
    </div>
  )
}
