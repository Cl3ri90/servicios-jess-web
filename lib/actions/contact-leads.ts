'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { headers } from 'next/headers'

import { validateAdminAccess } from '@/lib/admin/permissions'
import { LeadStatus, LeadPriority, LeadPipelineStage, LeadActivityType } from '@prisma/client'
import { anonymizeIp } from '@/lib/security/anonymize-ip'

const contactLeadSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(80, "El nombre es muy largo"),
  company: z.string().max(100).optional().nullish(),
  email: z.string().email("Correo inválido"),
  phone: z.string().max(30).optional().nullish(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(1000, "El mensaje es muy largo"),
  pageUrl: z.string().max(300).optional().nullish(),
  source: z.string().default('contact_form'),
})

// Calculate basic score
function calculateLeadScore(data: any) {
  let score = 0;
  if (data.company && data.company.trim() !== '') score += 20;
  if (data.phone && data.phone.trim() !== '') score += 15;
  if (data.message && data.message.length > 80) score += 15;
  
  const source = data.source || '';
  if (source.includes('contact_form') || source.includes('cta')) score += 20;

  const keywords = ['cotización', 'cotizacion', 'fabricar', 'urgente', 'proyecto', 'estructura', 'goma', 'plástico', 'plastico', 'maestranza', 'mecanizado'];
  const msgLower = (data.message || '').toLowerCase();
  
  for (const kw of keywords) {
    if (msgLower.includes(kw)) {
      score += 10;
      break; // apply once
    }
  }

  return score;
}

function determineInitialPriority(score: number): LeadPriority {
  if (score >= 85) return 'URGENT';
  if (score >= 60) return 'HIGH';
  return 'NORMAL';
}

export async function createContactLead(formData: FormData) {
  try {
    const website = formData.get('website');
    if (website) return { success: true, message: 'Su mensaje ha sido enviado exitosamente.' };

    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string | null,
      company: formData.get('company') as string | null,
      message: formData.get('message') as string,
      pageUrl: formData.get('pageUrl') as string | null,
      source: (formData.get('source') as string) || 'contact_form',
    }

    const { success, data, error } = contactLeadSchema.safeParse(rawData)
    if (!success) return { success: false, error: 'Datos de formulario inválidos.' }

    const headersList = await headers();
    const rawIpAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const ipAddress = anonymizeIp(rawIpAddress) || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentLeadsCount = await prisma.lead.count({
      where: {
        OR: [
          { email: data.email },
          { ipAddress: ipAddress !== 'unknown' ? ipAddress : undefined }
        ],
        createdAt: { gte: tenMinutesAgo }
      }
    });

    if (recentLeadsCount >= 3) {
      return { success: false, error: "Hemos recibido varias solicitudes recientes. Intenta nuevamente más tarde." };
    }

    const score = calculateLeadScore(data);
    const priority = determineInitialPriority(score);

    const newLead = await prisma.lead.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        message: data.message,
        pageUrl: data.pageUrl,
        source: data.source,
        status: 'NEW',
        priority: priority,
        pipelineStage: 'INBOX',
        score: score,
        userAgent,
        ipAddress,
        activities: {
          create: {
            type: 'CREATED',
            title: 'Lead ingresado',
            note: `Score inicial: ${score} - Prioridad: ${priority}`
          }
        }
      }
    });

    // 5. Send automated emails isolated from main flow
    try {
      const { sendLeadConfirmationEmail, sendInternalNewLeadNotification } = await import('@/lib/email/lead-emails');
      
      try {
        await sendLeadConfirmationEmail(newLead);
      } catch (e) {
        console.error("Lead confirmation email failed", e);
      }

      try {
        await sendInternalNewLeadNotification(newLead);
      } catch (e) {
        console.error("Internal lead notification failed", e);
      }
    } catch (e) {
      console.error("Could not load email service module", e);
    }

    revalidatePath('/admin/developer/leads');
    revalidatePath('/admin/owner/leads');
    return { success: true, message: 'Solicitud enviada correctamente. Nuestro equipo se pondrá en contacto contigo.' }
  } catch (error) {
    console.error('Lead Error:', error)
    return { success: false, error: 'Ocurrió un error al enviar el mensaje. Intente de nuevo más tarde.' }
  }
}

// CRM Actions
export async function getLeadsCRM(filters?: any) {
  await validateAdminAccess("OWNER");
  
  const whereClause: any = {};
  
  if (filters?.isArchived !== undefined) {
    whereClause.isArchived = filters.isArchived;
  } else {
    whereClause.isArchived = false;
  }
  
  if (filters?.status) whereClause.status = filters.status;
  if (filters?.priority) whereClause.priority = filters.priority;
  if (filters?.pipelineStage) whereClause.pipelineStage = filters.pipelineStage;
  if (filters?.search) {
    whereClause.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { company: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters?.overdueFollowUp) {
    whereClause.nextFollowUpAt = { lt: new Date() };
  }

  return prisma.lead.findMany({
    where: whereClause,
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}

export async function getLeadById(id: string) {
  await validateAdminAccess("OWNER");
  return prisma.lead.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' }
      },
      emails: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export async function updateLeadStatus(id: string, newStatus: LeadStatus, extraData?: { estimatedValue?: number, lostReason?: string }) {
  await validateAdminAccess("OWNER");
  
  const dataToUpdate: any = { status: newStatus };
  const activityNote = [];
  
  if (newStatus === 'WON') {
    dataToUpdate.closedAt = new Date();
    dataToUpdate.pipelineStage = 'WON';
    if (extraData?.estimatedValue) {
      dataToUpdate.estimatedValue = extraData.estimatedValue;
      activityNote.push(`Valor estimado: $${extraData.estimatedValue}`);
    }
  } else if (newStatus === 'LOST') {
    dataToUpdate.closedAt = new Date();
    dataToUpdate.pipelineStage = 'LOST';
    if (extraData?.lostReason) {
      dataToUpdate.lostReason = extraData.lostReason;
      activityNote.push(`Razón de pérdida: ${extraData.lostReason}`);
    }
  }

  await prisma.lead.update({
    where: { id },
    data: {
      ...dataToUpdate,
      activities: {
        create: {
          type: 'STATUS_CHANGED',
          title: `Estado cambiado a ${newStatus}`,
          note: activityNote.join(' | ') || null
        }
      }
    }
  });

  revalidatePath('/admin/developer/leads');
  revalidatePath('/admin/owner/leads');
  return { success: true };
}

export async function updateLeadPriority(id: string, priority: LeadPriority) {
  await validateAdminAccess("OWNER");
  await prisma.lead.update({
    where: { id },
    data: { 
      priority,
      activities: {
        create: {
          type: 'PRIORITY_CHANGED',
          title: `Prioridad cambiada a ${priority}`
        }
      }
    }
  });
  revalidatePath('/admin/developer/leads');
  revalidatePath('/admin/owner/leads');
  return { success: true };
}

export async function updateLeadPipelineStage(id: string, pipelineStage: LeadPipelineStage, extraData?: { estimatedValue?: number, lostReason?: string }) {
  await validateAdminAccess("OWNER");

  const dataToUpdate: any = { pipelineStage };
  const activityNote = [];

  if (pipelineStage === 'WON') {
    dataToUpdate.status = 'WON';
    dataToUpdate.closedAt = new Date();
    if (extraData?.estimatedValue) {
      dataToUpdate.estimatedValue = extraData.estimatedValue;
      activityNote.push(`Valor estimado: $${extraData.estimatedValue}`);
    }
  } else if (pipelineStage === 'LOST') {
    dataToUpdate.status = 'LOST';
    dataToUpdate.closedAt = new Date();
    if (extraData?.lostReason) {
      dataToUpdate.lostReason = extraData.lostReason;
      activityNote.push(`Razón de pérdida: ${extraData.lostReason}`);
    }
  }

  await prisma.lead.update({
    where: { id },
    data: {
      ...dataToUpdate,
      activities: {
        create: {
          type: 'STAGE_CHANGED',
          title: `Etapa cambiada a ${pipelineStage}`,
          note: activityNote.join(' | ') || null
        }
      }
    }
  });

  revalidatePath('/admin/developer/leads');
  revalidatePath('/admin/owner/leads');
  return { success: true };
}

export async function updateLeadNote(id: string, internalNote: string) {
  await validateAdminAccess("OWNER");
  await prisma.lead.update({
    where: { id },
    data: { 
      internalNote,
      activities: {
        create: {
          type: 'NOTE_ADDED',
          title: `Nota interna actualizada`,
          note: internalNote
        }
      }
    }
  });
  revalidatePath('/admin/developer/leads');
  revalidatePath('/admin/owner/leads');
  return { success: true };
}

export async function addLeadActivity(id: string, type: LeadActivityType, title: string, note?: string) {
  await validateAdminAccess("OWNER");
  await prisma.leadActivity.create({
    data: {
      leadId: id,
      type,
      title,
      note
    }
  });
  revalidatePath('/admin/developer/leads');
  revalidatePath('/admin/owner/leads');
  return { success: true };
}

export async function setLeadFollowUp(id: string, nextFollowUpAt: Date | null) {
  await validateAdminAccess("OWNER");
  await prisma.lead.update({
    where: { id },
    data: {
      nextFollowUpAt,
      activities: {
        create: {
          type: 'FOLLOW_UP_SET',
          title: nextFollowUpAt ? `Seguimiento programado para ${nextFollowUpAt.toLocaleDateString()}` : `Seguimiento cancelado`
        }
      }
    }
  });
  revalidatePath('/admin/developer/leads');
  revalidatePath('/admin/owner/leads');
  return { success: true };
}

export async function archiveLead(id: string) {
  await validateAdminAccess("OWNER");
  await prisma.lead.update({
    where: { id },
    data: { 
      isArchived: true,
      archivedAt: new Date(),
      status: 'ARCHIVED',
      activities: {
        create: {
          type: 'ARCHIVED',
          title: 'Lead archivado'
        }
      }
    }
  });
  revalidatePath('/admin/developer/leads');
  revalidatePath('/admin/owner/leads');
  return { success: true };
}

export async function restoreLead(id: string) {
  await validateAdminAccess("OWNER");
  await prisma.lead.update({
    where: { id },
    data: { 
      isArchived: false,
      archivedAt: null,
      status: 'OPEN',
      activities: {
        create: {
          type: 'RESTORED',
          title: 'Lead restaurado'
        }
      }
    }
  });
  revalidatePath('/admin/developer/leads');
  revalidatePath('/admin/owner/leads');
  return { success: true };
}
