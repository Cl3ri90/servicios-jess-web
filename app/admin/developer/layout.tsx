import { ReactNode } from 'react';
import { validateAdminAccess } from '@/lib/admin/permissions';
import { getDynamicMenu } from '@/lib/admin/menu';
import { AdminShell } from '@/components/admin/AdminShell';
import { getSiteConfig } from '@/lib/site/get-site-config';

export default async function DeveloperLayout({ children }: { children: ReactNode }) {
  await validateAdminAccess('DEVELOPER');
  const links = await getDynamicMenu('DEVELOPER');
  const { config } = await getSiteConfig();

  return (
    <AdminShell 
      role="DEVELOPER"
      links={links}
      title="SJ Dev"
      subtitle="System Command Center"
      basePath="/admin/developer"
      logoUrl={config.logoUrl}
    >
      {children}
    </AdminShell>
  );
}
