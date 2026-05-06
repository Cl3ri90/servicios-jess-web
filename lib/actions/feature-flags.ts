'use server';

import { validateAdminAccess } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ToggleFlagSchema = z.object({
  key: z.string(),
  field: z.enum(['isActive', 'ownerVisible', 'ownerEditable', 'publicVisible']),
  value: z.boolean()
});

export async function updateFeatureFlag(data: unknown) {
  await validateAdminAccess("DEVELOPER");
  
  const valid = ToggleFlagSchema.safeParse(data);
  if (!valid.success) return { success: false, error: 'Datos inválidos' };

  try {
    const existing = await prisma.featureFlag.findUnique({ where: { key: valid.data.key } });
    if (!existing) return { success: false, error: 'Flag no encontrada' };

    await prisma.featureFlag.update({
      where: { key: valid.data.key },
      data: { [valid.data.field]: valid.data.value }
    });
    
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin/developer/trust');
    revalidatePath('/admin/owner/trust');
    revalidatePath('/', 'layout');
    revalidatePath('/');
    return { success: true, message: 'Feature Flag actualizada correctamente' };
  } catch (error) {
    return { success: false, error: 'Error actualizando registro' };
  }
}
