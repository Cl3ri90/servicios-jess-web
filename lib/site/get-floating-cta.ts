import { prisma } from '@/lib/prisma';

export async function getFloatingCTA() {
  const ctaFlag = await prisma.featureFlag.findUnique({ where: { key: 'cta_flotante' } });
  
  // Condición férrea de Feature Flags: 
  // No emitir el CTA si el módulo entero no está publicVisible o Active
  if (!ctaFlag?.isActive || !ctaFlag?.publicVisible) {
    return null;
  }

  const cta = await prisma.floatingCTA.findUnique({ where: { id: 'floating-cta' } });
  
  if (!cta || !cta.enabled) {
    return null;
  }

  return cta;
}
