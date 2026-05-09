'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { uploadPublicFile } from '@/lib/supabase/storage'
import { validateAdminAccess } from '@/lib/admin/permissions'
import { sanitizeRichText } from '@/lib/security/sanitize-html'

const portfolioSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  slug: z.string().min(3),
  category: z.string().nullable().optional(),
  clientName: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  specs: z.string().nullable().optional(),
  order: z.coerce.number().default(0),
  pieceType: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  richDescription: z.string().nullable().optional(),
  showClientName: z.boolean().default(false),
  publicClientName: z.string().nullable().optional(),
  internalNotes: z.string().nullable().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
  imageAlt: z.string().nullable().optional(),
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
      pieceType: formData.get('pieceType') as string | null,
      shortDescription: formData.get('shortDescription') as string | null,
      richDescription: formData.get('richDescription') as string | null,
      showClientName: formData.get('showClientName') === 'on' || formData.get('showClientName') === 'true',
      publicClientName: formData.get('publicClientName') as string | null,
      internalNotes: formData.get('internalNotes') as string | null,
      isPublished: formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true' || formData.get('isPublished') === null, // default true in UI maybe
      isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
      sortOrder: formData.get('sortOrder') || 0,
      imageAlt: formData.get('imageAlt') as string | null,
    }

    const validData = portfolioSchema.parse(rawData)
    const cleanRichDescription = sanitizeRichText(validData.richDescription || "");

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
        richDescription: cleanRichDescription,
        featuredImage,
        coverImageUrl: featuredImage, // alias
      }
    })

    revalidatePath('/admin/owner/portafolio')
    revalidatePath('/admin/developer/portafolio')
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
      pieceType: formData.get('pieceType') as string | null,
      shortDescription: formData.get('shortDescription') as string | null,
      richDescription: formData.get('richDescription') as string | null,
      showClientName: formData.get('showClientName') === 'on' || formData.get('showClientName') === 'true',
      publicClientName: formData.get('publicClientName') as string | null,
      internalNotes: formData.get('internalNotes') as string | null,
      isPublished: formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true',
      isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
      sortOrder: formData.get('sortOrder') || 0,
      imageAlt: formData.get('imageAlt') as string | null,
    }

    const validData = portfolioSchema.parse(rawData)
    const cleanRichDescription = sanitizeRichText(validData.richDescription || "");

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
        richDescription: cleanRichDescription,
        ...(featuredImage && { featuredImage, coverImageUrl: featuredImage }),
      }
    })

    revalidatePath(`/portafolio/${validData.slug}`)
    revalidatePath('/admin/owner/portafolio')
    revalidatePath('/admin/developer/portafolio')
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
    
    await prisma.portfolio.update({ 
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        isPublished: false
      }
    })
    
    revalidatePath('/admin/owner/portafolio')
    revalidatePath('/admin/developer/portafolio')
    revalidatePath('/portafolio')
    revalidatePath('/', 'layout')
    
    return { success: true, message: 'Proyecto eliminado.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Error al eliminar el proyecto.' }
  }
}
