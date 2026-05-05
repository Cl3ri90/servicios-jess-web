'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Debes proporcionar un email y una contraseña.' };
  }

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
            // Ignorado en server actions
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: error?.message || 'Credenciales inválidas.' };
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: data.user.id }
  });

  if (!dbUser) {
    return { error: 'Usuario no encontrado en la base de datos.' };
  }

  if (!dbUser.isActive) {
    return { error: 'Tu cuenta está inactiva.' };
  }

  if (dbUser.role === 'DEVELOPER') {
    redirect('/admin/developer');
  } else if (dbUser.role === 'OWNER') {
    redirect('/admin/owner');
  } else {
    // Default fallback
    redirect('/admin/owner');
  }
}

export async function logoutAction() {
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
            // Ignorado
          }
        },
      },
    }
  );

  await supabase.auth.signOut();
  redirect('/login');
}
