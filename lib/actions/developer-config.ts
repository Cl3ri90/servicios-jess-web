'use server';

import { checkDeveloper } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

const DeveloperConfigSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, 'Color HEX inválido').optional(),
  metaTitle: z.string().optional(),
  isMaintenance: z.boolean().optional(),
});

export async function updateDeveloperConfig(prevState: any, formData: FormData) {
  await checkDeveloper();
  
  const rawData = {
    name: formData.get('name'),
    primaryColor: formData.get('primaryColor'),
    metaTitle: formData.get('metaTitle'),
    isMaintenance: formData.get('isMaintenance') === 'on',
  };

  const valid = DeveloperConfigSchema.safeParse(rawData);
  if (!valid.success) return { success: false, error: 'Validación Zod fallida' };

  try {
    await prisma.siteConfig.update({
      where: { id: 'singleton' },
      data: valid.data
    });
    revalidatePath('/admin/developer/configuracion');
    revalidatePath('/');
    revalidatePath('/login');
    revalidateTag('site-config', 'max');
    return { success: true, message: 'Configuración maestra actualizada' };
  } catch (err) {
    return { success: false, error: 'Error escribiendo en BD' };
  }
}
