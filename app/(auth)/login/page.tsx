import { getSiteConfig } from '@/lib/site/get-site-config';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Acceso Restringido | Sistema de Gestión',
  description: 'Portal de administración y control operativo.',
};

export default async function LoginPage() {
  const { config } = await getSiteConfig();

  return <LoginForm logoUrl={config.logoUrl} />;
}
