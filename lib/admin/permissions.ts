import 'server-only';
import { getSession } from '@/lib/auth/get-session';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function checkDeveloper() {
  const session = await getSession();
  if (!session || session.role !== 'DEVELOPER') notFound();
  return session;
}

export async function checkOwnerAccess(moduleKey: string) {
  const session = await getSession();
  if (!session) notFound();
  
  if (session.role === 'DEVELOPER') {
    const flag = await prisma.featureFlag.findUnique({ where: { key: moduleKey } });
    return { 
      session, 
      flag: {
        ...(flag || { name: moduleKey }),
        ownerEditable: true, 
        isActive: true,
        ownerVisible: true,
        publicVisible: true
      } 
    };
  }

  if (session.role === 'OWNER') {
    const flag = await prisma.featureFlag.findUnique({ where: { key: moduleKey } });
    if (!flag || !flag.isActive || !flag.ownerVisible) notFound();
    return { session, flag };
  }
  
  notFound();
}

export async function checkOwnerEditableFlag(moduleKey: string) {
  const { session, flag } = await checkOwnerAccess(moduleKey);
  if (session.role === 'DEVELOPER') return true;
  if (!flag?.ownerEditable) return false;
  return true;
}

export async function validateAdminAccess(role: 'DEVELOPER' | 'OWNER') {
  const session = await getSession();
  if (!session) notFound();

  if (session.role === 'DEVELOPER') return session;

  if (role === 'OWNER' && session.role === 'OWNER') return session;

  notFound();
}
