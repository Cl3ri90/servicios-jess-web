import { ReactNode } from 'react';
import { validateAdminAccess } from '@/lib/admin/permissions';
import { getDynamicMenu } from '@/lib/admin/menu';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function DeveloperLayout({ children }: { children: ReactNode }) {
  await validateAdminAccess('DEVELOPER');
  const links = await getDynamicMenu('DEVELOPER');

  return (
    <AdminShell 
      role="DEVELOPER"
      links={links}
      title="SJ Dev"
      subtitle="System Command Center"
      basePath="/admin/developer"
    >
      {children}
    </AdminShell>
  );
}
