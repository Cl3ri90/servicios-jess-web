import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
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
            // Se ignora en Server Components
          }
        },
      },
    }
  );
}

/**
 * Resolves the current identity and profile from Prisma.
 * If user exists via Supabase but isn't linked, tries to link by email.
 */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!profile) {
    // Attempt one-time link by email if profile exists but lacks authId
    if (user.email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (existingByEmail && !existingByEmail.authId) {
        const updated = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { authId: user.id }
        });
        return updated;
      }
    }
    return null;
  }

  return profile;
}

/**
 * Ensures a DEVELOPER role.
 */
export async function requireDeveloper() {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    redirect('/login');
  }

  if (profile.role !== 'DEVELOPER') {
    redirect('/'); // Unauthorized fallback
  }

  return profile;
}

/**
 * Ensures an OWNER role (or DEVELOPER for support).
 */
export async function requireOwner() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/login');
  }

  // Developer can access owner views for debugging/support
  if (profile.role === 'DEVELOPER') {
    return profile;
  }

  if (profile.role !== 'OWNER') {
    redirect('/');
  }

  return profile;
}
