'use server';

import { prisma } from '@/lib/prisma';
import { validateAdminAccess } from '@/lib/admin/permissions';
import { revalidatePath } from 'next/cache';

export async function upsertCompanyInfo(prevState: any, formData: FormData) {
  try {
    await validateAdminAccess('DEVELOPER');

    const data = {
      history: formData.get('history') as string,
      mission: formData.get('mission') as string,
      vision: formData.get('vision') as string,
      values: formData.get('values') as string,
    };

    await prisma.companyInfo.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { 
        id: 'singleton', 
        tenantId: 'single', 
        title: 'Nuestra Empresa',
        description: 'Información institucional...',
        ...data 
      }
    });

    revalidatePath('/empresa');
    revalidatePath('/', 'layout');
    revalidatePath('/admin/developer/empresa');

    return { success: true, message: 'Información de empresa guardada.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Hubo un error guardando.' };
  }
}
