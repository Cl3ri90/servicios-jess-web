'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { uploadPublicFile } from '@/lib/supabase/storage'
import { validateAdminAccess } from '@/lib/admin/permissions'

const portfolioSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  slug: z.string().min(3),
  category: z.string().nullable().optional(),
  clientName: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  specs: z.string().nullable().optional(),
  order: z.coerce.number().default(0),
})

export async function createPortfolio(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const rawData = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string) || (formData.get('title') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.get('category') as string | null,
      clientName: formData.get('clientName') as string | null,
      industry: formData.get('industry') as string | null,
      material: formData.get('material') as string | null,
      specs: formData.get('specs') as string | null,
      order: formData.get('order') || 0,
    }

    const validData = portfolioSchema.parse(rawData)

    const file = formData.get('featuredImage') as File | null
    let featuredImage = null

    if (file && file.size > 0) {
      const upload = await uploadPublicFile({
        bucket: "servicios-jess-assets",
        path: "portafolio",
        file,
        contentType: file.type,
      });

      if (!upload.success) {
        return { success: false, error: `No se pudo subir la imagen: ${upload.error}` };
      }
      featuredImage = upload.publicUrl;
    }

    await prisma.portfolio.create({
      data: {
        ...validData,
        featuredImage,
      }
    })

    revalidatePath('/admin/owner/portafolio')
    revalidatePath('/portafolio')
    revalidatePath('/', 'layout')
    
    return { success: true, message: 'Proyecto agregado al portafolio exitosamente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: error.message || 'Fallo al agregar proyecto.' }
  }
}

export async function updatePortfolio(id: string, formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      category: formData.get('category') as string | null,
      clientName: formData.get('clientName') as string | null,
      industry: formData.get('industry') as string | null,
      material: formData.get('material') as string | null,
      specs: formData.get('specs') as string | null,
      order: formData.get('order') || 0,
    }

    const validData = portfolioSchema.parse(rawData)

    const file = formData.get('featuredImage') as File | null
    let featuredImage = undefined

    if (file && file.size > 0) {
      const upload = await uploadPublicFile({
        bucket: "servicios-jess-assets",
        path: "portafolio",
        file,
        contentType: file.type,
      });

      if (!upload.success) {
        return { success: false, error: `No se pudo subir la imagen: ${upload.error}` };
      }
      featuredImage = upload.publicUrl;
    }

    await prisma.portfolio.update({
      where: { id },
      data: {
        ...validData,
        ...(featuredImage && { featuredImage }),
      }
    })

    revalidatePath(`/portafolio/${validData.slug}`)
    revalidatePath('/admin/owner/portafolio')
    revalidatePath('/portafolio')
    revalidatePath('/', 'layout')
    
    return { success: true, message: 'Proyecto actualizado correctamente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: error.message || 'Fallo al actualizar el proyecto.' }
  }
}

export async function deletePortfolio(id: string) {
  try {
    await validateAdminAccess("OWNER");
    
    await prisma.portfolio.delete({ where: { id } })
    
    revalidatePath('/admin/owner/portafolio')
    revalidatePath('/portafolio')
    revalidatePath('/', 'layout')
    
    return { success: true, message: 'Proyecto eliminado.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Error al eliminar el proyecto.' }
  }
}
