'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { uploadPublicFile } from '@/lib/supabase/storage'
import { validateAdminAccess } from '@/lib/admin/permissions'

const serviceSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  slug: z.string().min(3),
  shortDesc: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
})

export async function createService(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const rawData = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string) || (formData.get('title') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDesc: formData.get('shortDesc') as string | null,
      content: formData.get('content') as string | null,
      order: formData.get('order') || 0,
      isActive: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
    }

    const validData = serviceSchema.parse(rawData)

    // Handle Image
    const file = formData.get('featuredImage') as File | null
    let featuredImage = null

    if (file && file.size > 0) {
      const upload = await uploadPublicFile({
        bucket: "servicios-jess-assets",
        path: "services",
        file,
        contentType: file.type,
      });

      if (!upload.success) {
        return { success: false, error: `No se pudo subir la imagen: ${upload.error}` };
      }
      featuredImage = upload.publicUrl;
    }

    // Handle PDF
    let pdfUrl = null
    const pdfFile = formData.get('pdfDoc') as File | null
    if (pdfFile && pdfFile.size > 0) {
      const uploadPdf = await uploadPublicFile({
        bucket: "servicios-jess-assets",
        path: "services/pdfs",
        file: pdfFile,
        contentType: "application/pdf",
      });
      if (uploadPdf.success) {
        pdfUrl = uploadPdf.publicUrl;
      }
    }

    await prisma.service.create({
      data: {
        ...validData,
        featuredImage, 
        pdfUrl,
      }
    })

    revalidatePath('/admin/owner/servicios')
    revalidatePath('/servicios')
    revalidatePath('/', 'layout')
    
    return { success: true, message: 'Servicio creado exitosamente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: error.message || 'Fallo al crear servicio.' }
  }
}

export async function updateService(id: string, formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      shortDesc: formData.get('shortDesc') as string | null,
      content: formData.get('content') as string | null,
      order: formData.get('order') || 0,
      isActive: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
    }

    const validData = serviceSchema.parse(rawData)

    // Handle Image
    const file = formData.get('featuredImage') as File | null
    let featuredImage = undefined

    if (file && file.size > 0) {
      const upload = await uploadPublicFile({
        bucket: "servicios-jess-assets",
        path: "services",
        file,
        contentType: file.type,
      });

      if (!upload.success) {
        return { success: false, error: `No se pudo subir la imagen: ${upload.error}` };
      }
      featuredImage = upload.publicUrl;
    }

    // Handle PDF
    let pdfUrl = undefined
    const pdfFile = formData.get('pdfDoc') as File | null
    if (pdfFile && pdfFile.size > 0) {
      const uploadPdf = await uploadPublicFile({
        bucket: "servicios-jess-assets",
        path: "services/pdfs",
        file: pdfFile,
        contentType: "application/pdf",
      });
      if (uploadPdf.success) {
        pdfUrl = uploadPdf.publicUrl;
      }
    }

    await prisma.service.update({
      where: { id },
      data: {
        ...validData,
        ...(featuredImage && { featuredImage }),
        ...(pdfUrl && { pdfUrl }),
      }
    })

    revalidatePath(`/servicios/${validData.slug}`)
    revalidatePath('/admin/owner/servicios')
    revalidatePath('/servicios')
    revalidatePath('/', 'layout')
    
    return { success: true, message: 'Servicio actualizado correctamente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: error.message || 'Fallo al actualizar el servicio.' }
  }
}

export async function deleteService(id: string) {
  try {
    await validateAdminAccess("OWNER");
    
    await prisma.service.delete({ where: { id } })
    
    revalidatePath('/admin/owner/servicios')
    revalidatePath('/servicios')
    revalidatePath('/', 'layout')
    
    return { success: true, message: 'Servicio eliminado permanentemente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Error al eliminar el servicio.' }
  }
}
