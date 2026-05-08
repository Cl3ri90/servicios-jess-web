'use server';

import { checkOwnerEditableFlag } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ServiceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, 'Título muy corto').max(100),
  description: z.string().min(10, 'Descripción obligatoria'),
  shortDescription: z.string().max(120, 'Máximo 120 caracteres'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  iconName: z.string().optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ActionState = { success: boolean; message?: string; error?: string };

import { sanitizeRichText } from '@/lib/security/sanitize-html';

export async function upsertServiceCapability(prevState: any, formData: FormData): Promise<ActionState> {
  const canEdit = await checkOwnerEditableFlag('capacidades');
  if (!canEdit) return { success: false, error: 'Acción bloqueada. Modulo solo lectura.' };

  const rawData = {
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    description: sanitizeRichText(formData.get('description') as string),
    shortDescription: formData.get('shortDescription'),
    imageUrl: formData.get('imageUrl') || '',
    iconName: formData.get('iconName') || '',
    order: formData.get('order') || 0,
    isActive: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
  };

  const valid = ServiceSchema.safeParse(rawData);
  if (!valid.success) return { success: false, error: 'Validación de datos fallida' };

  try {
    if (valid.data.id) {
      const { id, ...data } = valid.data;
      await prisma.serviceCapability.update({
        where: { id },
        data,
      });
    } else {
      await prisma.serviceCapability.create({
        data: valid.data,
      });
    }

    revalidatePath('/admin/owner/capacidades');
    revalidatePath('/servicios');
    revalidatePath('/', 'layout');

    return { success: true, message: 'Servicio guardado exitosamente.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error interno guardando registro.' };
  }
}

export async function deleteServiceCapability(id: string) {
  const canEdit = await checkOwnerEditableFlag('capacidades');
  if (!canEdit) return { success: false, error: 'Modulo protegido.' };

  try {
    await prisma.serviceCapability.delete({ where: { id } });
    revalidatePath('/admin/owner/capacidades');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Error eliminando servicio' };
  }
}

const HeaderSchema = z.object({
  title: z.string().min(2, 'Título muy corto').max(60),
  introText: z.string().min(10, 'Texto muy corto').max(220),
});

export async function updateCapabilitiesHeader(prevState: any, formData: FormData): Promise<ActionState> {
  const canEdit = await checkOwnerEditableFlag('capacidades');
  if (!canEdit) return { success: false, error: 'Acción bloqueada. Modulo solo lectura.' };

  const rawData = {
    title: formData.get('title'),
    introText: formData.get('introText'),
  };

  const valid = HeaderSchema.safeParse(rawData);
  if (!valid.success) return { success: false, error: 'Validación fallida: ' + valid.error.issues[0].message };

  try {
    await prisma.siteConfig.update({
      where: { id: 'singleton' },
      data: {
        capabilitiesTitle: valid.data.title,
        capabilitiesIntroText: valid.data.introText,
      },
    });

    revalidatePath('/');
    revalidatePath('/servicios');
    revalidatePath('/admin/owner/capacidades');
    
    return { success: true, message: 'Textos de sección actualizados.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error guardando textos de sección.' };
  }
}

