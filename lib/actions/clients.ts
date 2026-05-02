'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { uploadPublicFile } from '@/lib/supabase/storage'
import { validateAdminAccess } from '@/lib/admin/permissions'

const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  order: z.coerce.number().default(0),
})

export async function createClient(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const rawData = {
      name: formData.get('name') as string,
      order: formData.get('order') || 0,
    }
    const validData = clientSchema.parse(rawData)

    const file = formData.get('logoUrl') as File | null
    let logoUrl = null

    if (file && file.size > 0) {
      const upload = await uploadPublicFile({
        bucket: "servicios-jess-assets",
        path: "clients",
        file,
        contentType: file.type,
      });

      if (!upload.success) {
        return { success: false, error: `No se pudo subir el logo: ${upload.error}` };
      }
      logoUrl = upload.publicUrl;
    }

    await prisma.client.create({
      data: {
        ...validData,
        logoUrl,
      }
    })

    revalidatePath('/admin/owner/clientes')
    revalidatePath('/')
    return { success: true, message: 'Cliente agregado exitosamente.' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message || 'Fallo al agregar cliente.' }
  }
}

export async function deleteClient(id: string) {
  try {
    await validateAdminAccess("OWNER");

    await prisma.client.delete({ where: { id } })
    
    revalidatePath('/admin/owner/clientes')
    revalidatePath('/')
    return { success: true, message: 'Cliente eliminado.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Error al eliminar el cliente.' }
  }
}
