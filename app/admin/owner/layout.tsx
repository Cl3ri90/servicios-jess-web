import { ReactNode } from 'react';
import { validateAdminAccess } from '@/lib/admin/permissions';
import { getDynamicMenu } from '@/lib/admin/menu';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function OwnerLayout({ children }: { children: ReactNode }) {
  const session = await validateAdminAccess('OWNER');
  const links = await getDynamicMenu(session.role);

  return (
    <AdminShell 
      role="OWNER"
      links={links}
      title="SJ Portal"
      subtitle="Operations Panel"
      basePath="/admin/owner"
    >
      {children}
    </AdminShell>
  );
}
