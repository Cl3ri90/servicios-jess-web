'use server'

import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

export async function updatePublicModuleOrder(items: { key: string, publicOrder: number }[]) {
  try {
    for (const item of items) {
      if (!item.key) continue;
      await prisma.featureFlag.update({
        where: { key: item.key },
        data: { publicOrder: item.publicOrder }
      });
    }

    revalidatePath('/')
    revalidatePath('/admin/developer/flags')
    
    return { success: true }
  } catch (err: any) {
    console.error('updatePublicModuleOrder error:', err)
    return { error: 'Error actualizando el orden de los módulos.' }
  }
}

export async function resetPublicModuleOrder() {
  const defaults: Record<string, number> = {
    'indicadores': 10,
    'capacidades': 20,
    'trust': 30,
    'portafolio': 40,
    'cta_principal': 50,
  }

  try {
    for (const [key, order] of Object.entries(defaults)) {
      try {
        await prisma.featureFlag.update({
          where: { key },
          data: { publicOrder: order }
        });
      } catch (e) {
        // Ignore if flag doesn't exist
      }
    }

    revalidatePath('/')
    revalidatePath('/admin/developer/flags')

    return { success: true }
  } catch (err: any) {
    console.error('resetPublicModuleOrder error:', err)
    return { error: 'Error restableciendo el orden.' }
  }
}
