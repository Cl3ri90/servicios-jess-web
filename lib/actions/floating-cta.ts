'use server';

import { validateAdminAccess } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CTAFormSchema = z.object({
  enabled: z.boolean().default(false),
  label: z.string().min(1, 'El texto del botón es requerido'),
  href: z.string().min(1, 'El enlace es requerido'),
  position: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']).default('bottom-right'),
  iconName: z.string().optional().or(z.literal('')),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un HEX válido, ej: #ea580c').default('#ea580c'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un HEX válido, ej: #ffffff').default('#ffffff'),
  openInNewTab: z.boolean().default(false),
});

export type FloatingActionState = { success: boolean; message?: string; error?: string };

export async function updateFloatingCTA(prevState: any, formData: FormData): Promise<FloatingActionState> {
  await validateAdminAccess('DEVELOPER');

  const raw = {
    enabled: formData.get('enabled') === 'on' || formData.get('enabled') === 'true',
    label: formData.get('label'),
    href: formData.get('href'),
    position: formData.get('position') || 'bottom-right',
    iconName: formData.get('iconName') || '',
    backgroundColor: formData.get('backgroundColor') || '#ea580c',
    textColor: formData.get('textColor') || '#ffffff',
    openInNewTab: formData.get('openInNewTab') === 'on' || formData.get('openInNewTab') === 'true',
  };

  const valid = CTAFormSchema.safeParse(raw);
  if (!valid.success) {
    return { success: false, error: valid.error.issues[0].message };
  }

  try {
    await prisma.floatingCTA.upsert({
      where: { id: 'floating-cta' },
      update: valid.data,
      create: { id: 'floating-cta', ...valid.data }
    });

    revalidatePath('/admin/developer/cta-flotante');
    revalidatePath('/', 'layout');

    return { success: true, message: 'Configuración de CTA Flotante actualizada.' };
  } catch (error) {
    console.error('Error updating floating CTA:', error);
    return { success: false, error: 'Error interno guardando configuración.' };
  }
}
