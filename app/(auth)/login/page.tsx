import { getSiteConfig } from '@/lib/site/get-site-config';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Ingreso al Sistema',
  description: 'Acceso privado.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nocache: true,
    },
  },
};

export default async function LoginPage() {
  const { config } = await getSiteConfig();

  return <LoginForm logoUrl={config.logoUrl} />;
}
