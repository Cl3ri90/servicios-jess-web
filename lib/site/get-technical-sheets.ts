import { prisma } from '@/lib/prisma';

export async function getPublicTechnicalSheets() {
  const docFlag = await prisma.featureFlag.findUnique({ where: { key: 'fichas_tecnicas' } });
  
  // Permiso de lectura pública global
  if (!docFlag?.isActive || !docFlag?.publicVisible) {
    return [];
  }

  const sheets = await prisma.technicalSheet.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return sheets;
}
