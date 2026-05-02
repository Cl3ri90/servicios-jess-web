'use server' 

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { validateAdminAccess } from '@/lib/admin/permissions'

export async function getActivePopup() {
  try {
    return await prisma.popup.findUnique({
      where: { id: "singleton" }
    })
  } catch (err) {
    return null
  }
}

export async function savePopupConfig(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const data = {
      isActive: formData.get('isActive') === 'true',
      title: (formData.get('title') as string) || '',
      text: (formData.get('text') as string) || null,
      buttonText: (formData.get('buttonText') as string) || null,
      url: (formData.get('url') as string) || null,
      imageUrl: (formData.get('imageUrl') as string) || null,
    }

    if (!data.title) return { success: false, error: 'El título del popup es requerido.' }

    await prisma.popup.upsert({
      where: { id: "singleton" },
      update: data,
      create: {
        id: "singleton",
        ...data
      }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/admin/owner/popup')
    
    return { success: true, message: 'Popup guardado correctamente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Error guardando datos del popup.' }
  }
}
