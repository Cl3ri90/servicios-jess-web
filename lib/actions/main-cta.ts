'use server';

import { checkDeveloper, checkOwnerEditableFlag } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { uploadPublicFile } from '@/lib/supabase/storage';

const MainCtaSchema = z.object({
  isEnabled: z.boolean(),
  eyebrow: z.string().max(40).optional().nullable(),
  titleLine1: z.string().min(2).max(80),
  titleHighlight: z.string().min(2).max(80),
  description: z.string().min(10).max(240),
  buttonText: z.string().min(2).max(40),
  buttonUrl: z.string().refine((val) => val.startsWith('/') || val.startsWith('https://'), {
    message: 'URL debe empezar con / o https://',
  }),
  backgroundColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, 'HEX inválido'),
  textColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, 'HEX inválido'),
  accentColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, 'HEX inválido'),
  overlayOpacity: z.number().min(0).max(100),
  alignment: z.enum(['center', 'left']),
  variant: z.enum(['industrial-center', 'compact', 'split']),
  showOnHome: z.boolean(),
  showOnEmpresa: z.boolean(),
  showOnServicios: z.boolean(),
  showOnPortfolio: z.boolean(),
  showOnContacto: z.boolean(),
});

export type ActionState = { success: boolean; message?: string; error?: string };

export async function updateMainCtaConfig(prevState: any, formData: FormData): Promise<ActionState> {
  // Verificamos permisos basados en roles o flags
  // Si es Owner, verificamos si tiene flag editable
  // Si es Developer, permitimos todo.
  try {
    const isDev = await checkDeveloper().then(() => true).catch(() => false);
    if (!isDev) {
      const canEdit = await checkOwnerEditableFlag('cta_principal');
      if (!canEdit) return { success: false, error: 'Acción bloqueada. Módulo en solo lectura o deshabilitado.' };
    }
  } catch (e) {
    return { success: false, error: 'Permisos insuficientes' };
  }

  try {
    const rawData = {
      isEnabled: formData.get('isEnabled') === 'on' || formData.get('isEnabled') === 'true',
      eyebrow: formData.get('eyebrow') as string,
      titleLine1: formData.get('titleLine1') as string,
      titleHighlight: formData.get('titleHighlight') as string,
      description: formData.get('description') as string,
      buttonText: formData.get('buttonText') as string,
      buttonUrl: formData.get('buttonUrl') as string,
      backgroundColor: formData.get('backgroundColor') as string || '#0a0a0a',
      textColor: formData.get('textColor') as string || '#ffffff',
      accentColor: formData.get('accentColor') as string || '#ea580c',
      overlayOpacity: parseInt(formData.get('overlayOpacity') as string) || 80,
      alignment: formData.get('alignment') as string || 'center',
      variant: formData.get('variant') as string || 'industrial-center',
      showOnHome: formData.get('showOnHome') === 'on' || formData.get('showOnHome') === 'true',
      showOnEmpresa: formData.get('showOnEmpresa') === 'on' || formData.get('showOnEmpresa') === 'true',
      showOnServicios: formData.get('showOnServicios') === 'on' || formData.get('showOnServicios') === 'true',
      showOnPortfolio: formData.get('showOnPortfolio') === 'on' || formData.get('showOnPortfolio') === 'true',
      showOnContacto: formData.get('showOnContacto') === 'on' || formData.get('showOnContacto') === 'true',
    };

    const valid = MainCtaSchema.safeParse(rawData);
    if (!valid.success) {
      console.error(valid.error);
      return { success: false, error: 'Validación de datos fallida. Revisa los campos.' };
    }

    const current = await prisma.mainCtaConfig.findUnique({ where: { id: 'main-cta-config' } });
    let backgroundImageUrl = current?.backgroundImageUrl || null;

    const bgFile = formData.get('bgFile') as File | null;
    if (bgFile && bgFile.size > 0) {
      const upload = await uploadPublicFile({ file: bgFile, bucket: 'servicios-jess-assets', path: 'cta' });
      if (!upload.success) return { success: false, error: `Error subiendo imagen: ${upload.error}` };
      backgroundImageUrl = upload.publicUrl!;
    }

    const removeBg = formData.get('removeBg') === 'true';
    if (removeBg) {
      backgroundImageUrl = null;
    }

    await prisma.mainCtaConfig.upsert({
      where: { id: 'main-cta-config' },
      update: { ...valid.data, backgroundImageUrl },
      create: { id: 'main-cta-config', ...valid.data, backgroundImageUrl },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/empresa');
    revalidatePath('/servicios');
    revalidatePath('/portafolio');
    revalidatePath('/contacto');
    revalidatePath('/admin', 'layout');

    return { success: true, message: 'Sección Llamada de Acción actualizada.' };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: 'Error escribiendo en BD.' };
  }
}
