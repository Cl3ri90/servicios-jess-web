'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { validateAdminAccess } from '@/lib/admin/permissions'

const companyInfoSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(10, 'La descripción es muy corta'),
  imageUrl: z.string().optional().nullish(),
  features: z.string().optional().nullish(),
  ctaText: z.string().optional().nullish(),
  ctaLink: z.string().optional().nullish(),
  showOnHome: z.boolean().default(true)
})

export async function getCompanyInfo() {
  try {
    return await prisma.companyInfo.findUnique({
      where: { id: 'singleton' }
    })
  } catch (error) {
    console.error('Error fetching company info:', error)
    return null
  }
}

export async function upsertCompanyInfo(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string | null
    const rawFeatures = formData.get('features') as string
    const ctaText = formData.get('ctaText') as string | null
    const ctaLink = formData.get('ctaLink') as string | null
    const showOnHome = formData.get('showOnHome') === 'true' || formData.get('showOnHome') === 'on'

    const parsed = companyInfoSchema.safeParse({
      title,
      description,
      imageUrl,
      features: rawFeatures || '[]',
      ctaText,
      ctaLink,
      showOnHome
    })

    if (!parsed.success) {
      return { success: false, error: 'Datos inválidos. Verifica que los campos obligatorios estén completos.' }
    }

    const { data } = parsed
    const cleanData = {
      ...data,
      features: data.features ?? '[]',
      imageUrl: data.imageUrl ?? null,
      ctaText: data.ctaText ?? null,
      ctaLink: data.ctaLink ?? null
    }

    await prisma.companyInfo.upsert({
      where: { id: 'singleton' },
      update: cleanData,
      create: { 
        id: 'singleton',
        ...cleanData
      }
    })

    revalidatePath('/')
    revalidatePath('/empresa')
    revalidatePath('/admin/owner/config')

    return { success: true, message: 'Información de la empresa actualizada exitosamente.' }
  } catch (error: any) {
    console.error('Error upserting company info:', error)
    return { success: false, error: 'Ocurrió un error guardando la información.' }
  }
}
