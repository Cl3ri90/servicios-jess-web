import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export type AuthContext = {
  authId: string;
  userId: string;
  email: string;
  role: Role;
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
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      authId: authUser.id,
    },
    select: {
      id: true,
      authId: true,
      email: true,
      role: true,
    },
  });

  if (!dbUser) {
    return null;
  }

  return {
    authId: authUser.id,
    userId: dbUser.id,
    role: dbUser.role,
    email: dbUser.email,
  };
}
