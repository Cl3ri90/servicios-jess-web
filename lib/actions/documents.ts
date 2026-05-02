'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { validateAdminAccess } from '@/lib/admin/permissions'

// ============================================================
// Read (public)
// ============================================================

export async function getTechnicalDocuments() {
  try {
    return await prisma.technicalDocument.findMany({
      where: { isPublic: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }]
    })
  } catch (error) {
    return []
  }
}

export async function getDocumentsForOwner() {
  try {
    return await prisma.technicalDocument.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }]
    })
  } catch (error) {
    return []
  }
}

// ============================================================
// Owner: Create document
// ============================================================

export async function createDocument(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const fileUrl = formData.get('fileUrl') as string
    const title = formData.get('title') as string

    if (!title || !fileUrl) return { success: false, error: 'Título y URL del archivo son requeridos.' }

    await prisma.technicalDocument.create({
      data: {
        title,
        description: (formData.get('description') as string) || null,
        category: (formData.get('category') as string) || 'general',
        fileUrl,
        isPublic: formData.get('isPublic') !== 'false',
        order: parseInt(formData.get('order') as string || '0', 10) || 0,
      }
    })

    revalidatePath('/servicios')
    revalidatePath('/admin/owner/descargas')
    
    return { success: true, message: 'Documento añadido correctamente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Sin permisos o error al guardar documento.' }
  }
}

// ============================================================
// Owner: Update document
// ============================================================

export async function updateDocument(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const id = formData.get('_docId') as string
    if (!id) return { success: false, error: 'ID no encontrado.' }

    await prisma.technicalDocument.update({
      where: { id },
      data: {
        title: formData.get('title') as string,
        description: (formData.get('description') as string) || null,
        category: (formData.get('category') as string) || 'general',
        fileUrl: formData.get('fileUrl') as string,
        isPublic: formData.get('isPublic') !== 'false',
        order: parseInt(formData.get('order') as string || '0', 10) || 0,
      }
    })

    revalidatePath('/servicios')
    revalidatePath('/admin/owner/descargas')
    
    return { success: true, message: 'Documento actualizado.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Error al actualizar el documento.' }
  }
}

// ============================================================
// Owner: Delete document
// ============================================================

export async function deleteDocument(id: string) {
  try {
    await validateAdminAccess("OWNER");

    await prisma.technicalDocument.delete({ where: { id } })

    revalidatePath('/servicios')
    revalidatePath('/admin/owner/descargas')
    
    return { success: true, message: 'Documento eliminado.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Error al eliminar el documento.' }
  }
}
