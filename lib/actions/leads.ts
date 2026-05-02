'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { validateAdminAccess } from '@/lib/admin/permissions'

const leadSchema = z.object({
  name: z.string().min(2, 'El nombre es muy corto'),
  email: z.string().email('Correo inválido'),
  phone: z.string().optional().nullish(),
  company: z.string().optional().nullish(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  source: z.string().default('web'),
})

export async function createLead(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string | null,
      company: formData.get('company') as string | null,
      message: formData.get('message') as string,
      source: (formData.get('source') as string) || 'web',
    }

    const { success, data } = leadSchema.safeParse(rawData)
    
    if (!success) {
      return { success: false, error: 'Datos de formulario inválidos. Por favor revisa los campos requeridos.' }
    }

    const newLead = await prisma.lead.create({
      data: {
        ...data,
        status: 'NEW'
      }
    })

    // Correos Transaccionales
    console.log('Nuevo lead recibido:', data);

    revalidatePath('/admin/owner/leads')
    
    return { success: true, message: 'Su mensaje ha sido enviado exitosamente. Un comercial lo contactará.' }
  } catch (error) {
    console.error('Lead Error:', error)
    return { success: false, error: 'Ocurrió un error al enviar el mensaje. Intente de nuevo más tarde.' }
  }
}

export async function updateLeadStatus(id: string, newStatus: string) {
  try {
    await validateAdminAccess("OWNER");

    await prisma.lead.update({
      where: { id },
      data: { status: newStatus }
    })
    revalidatePath('/admin/owner/leads')
    return { success: true, message: 'Estado del lead actualizado' }
  } catch (error) {
    return { success: false, error: 'Error actualizando el lead' }
  }
}

export async function deleteLeadAction(id: string) {
  try {
    await validateAdminAccess("OWNER");

    await prisma.lead.delete({
      where: { id }
    })
    revalidatePath('/admin/owner/leads')
    return { success: true, message: 'Registro eliminado exitosamente' }
  } catch (error) {
    console.error('Delete Lead Error:', error)
    return { success: false, error: 'Error al intentar eliminar el registro' }
  }
}

export async function replyLeadEmail(leadId: string, subject: string, message: string) {
  if (!subject.trim() || !message.trim()) {
    return { error: 'Debe proveer un asunto y un mensaje' }
  }

  try {
    await validateAdminAccess("OWNER");

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) return { error: 'No se encontró el Lead en la base de datos' }

    console.log('Nuevo correo a Lead (simulado):', { leadId, subject, message });

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'RESPONDED',
        repliedAt: new Date()
      }
    })

    revalidatePath('/admin/owner/leads')
    
    return { success: 'Su respuesta por correo ha sido procesada con éxito (Simulado)' }
  } catch (error: any) {
    console.error('CRM Reply Error:', error)
    return { error: 'Error sistémico impidió procesar la respuesta: ' + (error.message || String(error)) }
  }
}
