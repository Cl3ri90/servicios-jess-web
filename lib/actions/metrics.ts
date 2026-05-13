'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { validateAdminAccess } from '@/lib/admin/permissions'
import { z } from 'zod'

const metricSchema = z.object({
  value: z.string().min(1, "El valor es requerido"),
  label: z.string().min(1, "La etiqueta es requerida"),
  description: z.string().nullable().optional(),
  order: z.coerce.number().default(0),
})

export async function createMetric(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const rawData = {
      value: (formData.get('value') as string)?.trim(),
      label: (formData.get('label') as string)?.trim(),
      description: (formData.get('description') as string | null)?.trim() || null,
      order: formData.get('order') || 0,
    }
    const validData = metricSchema.parse(rawData)

    await prisma.metric.create({
      data: validData
    })

    revalidatePath('/admin/owner/metricas')
    revalidatePath('/')
    return { success: true, message: 'Métrica añadida exitosamente.' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message || 'Error validando métrica.' }
  }
}

export async function updateMetric(id: string, formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const rawData = {
      value: (formData.get('value') as string)?.trim(),
      label: (formData.get('label') as string)?.trim(),
      description: (formData.get('description') as string | null)?.trim() || null,
      order: formData.get('order') || 0,
    }
    const validData = metricSchema.parse(rawData)

    await prisma.metric.update({
      where: { id },
      data: validData
    })

    revalidatePath('/admin/owner/metricas')
    revalidatePath('/')
    return { success: true, message: 'Métrica actualizada exitosamente.' }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: err.message || 'Error actualizando métrica.' }
  }
}

export async function deleteMetric(id: string) {
  try {
    await validateAdminAccess("OWNER");
    
    await prisma.metric.delete({ where: { id } })
    
    revalidatePath('/admin/owner/metricas')
    revalidatePath('/')
    return { success: true, message: 'Métrica eliminada.' }
  } catch (error) {
    return { success: false, error: 'Error al borrar.' }
  }
}
