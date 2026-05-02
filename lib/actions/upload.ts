'use server'

import { uploadPublicFile } from '@/lib/supabase/storage'
import { validateAdminAccess } from '@/lib/admin/permissions'

export async function uploadImage(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");
  } catch (error) {
    return { error: 'No autorizado para subir archivos.' }
  }

  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'No se recibió archivo' }

  try {
    const upload = await uploadPublicFile({
      bucket: "servicios-jess-assets",
      path: "uploads",
      file,
      contentType: file.type,
    });

    if (!upload.success) {
      return { error: upload.error };
    }

    return { url: upload.publicUrl };
  } catch (error) {
    console.error('Error uploading file:', error)
    return { error: 'No se pudo subir la imagen.' }
  }
}
