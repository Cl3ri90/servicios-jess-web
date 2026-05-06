import { ReactNode } from 'react';
import { validateAdminAccess } from '@/lib/admin/permissions';
import { getDynamicMenu } from '@/lib/admin/menu';
import { AdminShell } from '@/components/admin/AdminShell';
import { getSiteConfig } from '@/lib/site/get-site-config';

export default async function OwnerLayout({ children }: { children: ReactNode }) {
  const session = await validateAdminAccess('OWNER');
  const links = await getDynamicMenu(session.role);
  const { config } = await getSiteConfig();

  return (
    <AdminShell 
      role="OWNER"
      links={links}
      title="SJ Portal"
      subtitle="Operations Panel"
      basePath="/admin/owner"
      logoUrl={config.logoUrl}
    >
      {children}
    </AdminShell>
  );
}
