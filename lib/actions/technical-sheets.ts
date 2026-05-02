'use server';

import { validateAdminAccess } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import { uploadPublicFile } from '@/lib/supabase/storage';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const TechnicalSheetSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(150),
  description: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  
  // Archivo y cover (si editamos, podrían no venir en el payload y leerse del existente)
  fileUrl: z.string().url('URL de archivo inválida').optional().or(z.literal('')),
  fileName: z.string().optional().or(z.literal('')),
  fileType: z.string().optional().or(z.literal('')),
  fileSize: z.coerce.number().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
});

export type SheetActionState = { success: boolean; message?: string; error?: string };

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20 MB

export async function upsertTechnicalSheet(prevState: any, formData: FormData): Promise<SheetActionState> {
  await validateAdminAccess('DEVELOPER');

  const id = formData.get('id')?.toString();
  
  // 1. Manejo del PDF (Opcional si es edición y no se sube uno nuevo)
  const file = formData.get('file') as File | null;
  let uploadData = {
    fileUrl: formData.get('existingFileUrl') as string || '',
    fileName: formData.get('existingFileName') as string || '',
    fileType: formData.get('existingFileType') as string || '',
    fileSize: Number(formData.get('existingFileSize')) || 0,
  };

  if (file && file.size > 0) {
    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Solo se permiten archivos PDF.' };
    }
    if (file.size > MAX_PDF_SIZE) {
      return { success: false, error: 'El archivo excede el tamaño máximo de 20MB.' };
    }

    const uploadRes = await uploadPublicFile({
      bucket: 'servicios-jess-assets',
      path: 'fichas-tecnicas',
      file,
      contentType: file.type
    });

    if (!uploadRes.success) {
      return { success: false, error: uploadRes.error || 'Fallo rotundo en la subida a Storage.' };
    }

    uploadData = {
      fileUrl: uploadRes.publicUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };
  }

  if (!uploadData.fileUrl) {
    return { success: false, error: 'La ficha requiere obligatoriamente un archivo PDF.' };
  }

  // 2. Manejo de Portada
  const coverFile = formData.get('coverFile') as File | null;
  let coverImageUrl = formData.get('existingCoverUrl') as string || '';

  if (coverFile && coverFile.size > 0) {
     if (coverFile.size > 5 * 1024 * 1024) return { success: false, error: 'La portada excede los 5MB permitidos.' };
     const _coverUp = await uploadPublicFile({
       bucket: 'servicios-jess-assets',
       path: 'fichas-tecnicas/covers',
       file: coverFile,
       contentType: coverFile.type
     });
     if (_coverUp.success && _coverUp.publicUrl) {
        coverImageUrl = _coverUp.publicUrl;
     }
  }

  // 3. Procesamiento en Zod
  const raw = {
    id,
    title: formData.get('title'),
    description: formData.get('description') || '',
    category: formData.get('category') || '',
    order: formData.get('order') || 0,
    isActive: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
    fileUrl: uploadData.fileUrl,
    fileName: uploadData.fileName,
    fileType: uploadData.fileType,
    fileSize: uploadData.fileSize,
    coverImageUrl,
  };

  const valid = TechnicalSheetSchema.safeParse(raw);
  if (!valid.success) {
    return { success: false, error: valid.error.issues[0].message };
  }

  try {
    if (valid.data.id) {
       await prisma.technicalSheet.update({
         where: { id: valid.data.id },
         data: valid.data
       });
    } else {
       await prisma.technicalSheet.create({
         data: valid.data
       });
    }

    revalidatePath('/admin/developer/catalogo-fichas');
    revalidatePath('/fichas-tecnicas');
    return { success: true, message: 'Ficha Técnica guardada exitosamente.' };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Error persistiendo la ficha en la base de datos.' };
  }
}

export async function deleteTechnicalSheet(id: string) {
  await validateAdminAccess('DEVELOPER');
  try {
     // NOTE: We could delete the file from supabase storage here if we wanted to
     // For now, only deleting from database logic.
     await prisma.technicalSheet.delete({ where: { id } });
     revalidatePath('/admin/developer/catalogo-fichas');
     revalidatePath('/fichas-tecnicas');
     return { success: true };
  } catch(err) {
     return { success: false, error: 'No se pudo eliminar el registro.' };
  }
}

export async function toggleTechnicalSheetStatus(id: string, isActive: boolean) {
  await validateAdminAccess('DEVELOPER');
  try {
     await prisma.technicalSheet.update({ where: { id }, data: { isActive } });
     revalidatePath('/admin/developer/catalogo-fichas');
     revalidatePath('/fichas-tecnicas');
     return { success: true };
  } catch(err) {
     return { success: false, error: 'No se pudo invertir el estado.' };
  }
}
