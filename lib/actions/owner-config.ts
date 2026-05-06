'use server';

import { checkOwnerEditableFlag } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const OwnerConfigSchema = z.object({
  contactEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  heroTitle: z.string().max(80, 'El título es muy largo').min(1, 'Obligatorio'),
  heroSubtitle: z.string().max(200, 'El subtítulo es muy largo').optional(),
});

export type ActionState = { success: boolean; message?: string; error?: string };

export async function updateOwnerConfig(prevState: any, formData: FormData): Promise<ActionState> {
  const canEdit = await checkOwnerEditableFlag('configuracion_owner');
  if (!canEdit) return { success: false, error: 'Acción bloqueada. Modulo en solo lectura.' };

  const valid = OwnerConfigSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!valid.success) return { success: false, error: 'Validación Zod fallida' };

  try {
    await prisma.siteConfig.update({
      where: { id: 'singleton' },
      data: valid.data
    });
    revalidatePath('/admin/owner/configuracion');
    revalidatePath('/');
    revalidatePath('/login');
    return { success: true, message: 'Información operativa actualizada' };
  } catch (err) {
    return { success: false, error: 'Error escribiendo en BD' };
  }
}
