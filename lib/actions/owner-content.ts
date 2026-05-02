'use server';

import { getSession } from '@/lib/auth/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const OwnerContentSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z.string().min(6, 'Teléfono muy corto').optional().or(z.literal('')),
  heroTitle: z.string().min(1, 'El título principal es obligatorio'),
  heroSubtitle: z.string().optional(),
});

type ActionState = { success: boolean; message?: string; error?: string };

export async function updateOwnerContent(
  prevState: any,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();

  if (!session || (session.role !== 'OWNER' && session.role !== 'DEVELOPER')) {
    return { success: false, error: 'Operación denegada. Privilegios insuficientes.' };
  }

  const rawData = {
    email: formData.get('email'),
    phone: formData.get('phone'),
    heroTitle: formData.get('heroTitle'),
    heroSubtitle: formData.get('heroSubtitle'),
  };

  const validation = OwnerContentSchema.safeParse(rawData);

  if (!validation.success) {
    return { success: false, error: 'Carga de datos inválida enviada desde el cliente.' };
  }

  const { email, phone, heroTitle, heroSubtitle } = validation.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.pageBlock.upsert({
        where: { slug: 'contact-info' },
        update: { content: JSON.stringify({ email, phone }) },
        create: { slug: 'contact-info', title: 'Contacto Principal', content: JSON.stringify({ email, phone }) },
      });

      await tx.pageBlock.upsert({
        where: { slug: 'home-hero' },
        update: { title: heroTitle, content: heroSubtitle || '' }, 
        create: { slug: 'home-hero', title: heroTitle, content: heroSubtitle || '' },
      });
    });

    revalidatePath('/');
    revalidatePath('/admin/owner');

    return { success: true, message: 'Perfil de negocio y portada actualizados correctamente.' };
  } catch (error) {
    return { success: false, error: 'Colapso de red en la escritura en base de datos.' };
  }
}
