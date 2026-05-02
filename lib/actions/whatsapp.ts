'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { validateAdminAccess } from '@/lib/admin/permissions'

const whatsappSchema = z.object({
  phoneNumber: z.string().min(8, 'Número inválido'),
  defaultMessage: z.string().optional().nullish(),
})

export async function getWhatsAppConfig() {
  try {
    return await prisma.whatsAppConfig.findUnique({
      where: { id: 'singleton' }
    })
  } catch (err) {
    return null
  }
}

export async function upsertWhatsAppConfig(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const phoneNumber = formData.get('phoneNumber') as string
    const defaultMessage = formData.get('defaultMessage') as string

    const parsed = whatsappSchema.safeParse({ phoneNumber, defaultMessage })
    if (!parsed.success) {
      return { error: 'Datos no válidos' }
    }

    const { data } = parsed

    await prisma.whatsAppConfig.upsert({
      where: { id: 'singleton' },
      update: {
        phoneNumber: data.phoneNumber,
        defaultMessage: data.defaultMessage || null,
      },
      create: {
        id: 'singleton',
        phoneNumber: data.phoneNumber,
        defaultMessage: data.defaultMessage || null,
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/owner/whatsapp')

    return { success: true, message: 'Configuración guardada exitosamente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: error?.message || 'Error guardando datos de WhatsApp.' }
  }
}
