import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export type AuthContext = {
  authId: string;
  userId: string;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
} | null;

export async function getSession(): Promise<AuthContext> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se ignora en RSC Server Components
          }
        },
      },
    }
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return null;
  }

  const authUser = session.user;

  const dbUser = await prisma.user.findUnique({
    where: {
      authId: authUser.id,
    },
    select: {
      id: true,
      authId: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!dbUser) {
    return null;
  }

  if (dbUser.isActive === false) {
    return null;
  }

  return {
    authId: dbUser.authId,
    userId: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    isActive: dbUser.isActive,
  };
}
