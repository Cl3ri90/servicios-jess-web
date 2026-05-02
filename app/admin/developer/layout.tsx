import { ReactNode } from 'react';
import { SidebarNav } from '@/components/admin/SidebarNav';
import { logoutAction } from '@/lib/actions/auth';
import { validateAdminAccess } from '@/lib/admin/permissions';
import { getDynamicMenu } from '@/lib/admin/menu';

export default async function DeveloperLayout({ children }: { children: ReactNode }) {
  await validateAdminAccess('DEVELOPER');

  return (
    <div className="flex min-h-screen bg-black font-sans">
      <aside className="w-64 bg-zinc-950 p-6 flex flex-col gap-6 shrink-0 border-r border-zinc-800 justify-between">
        <div className="flex flex-col gap-6 h-full">
            <div>
              <h1 className="text-xl text-[#ea580c] font-black uppercase tracking-tight">SJ Dev</h1>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-mono">System Command Center</p>
            </div>
            <SidebarNav 
              basePath="/admin/developer" 
              isDeveloper={true}
              links={await getDynamicMenu('DEVELOPER')}
            />
        </div>
        <form action={logoutAction}>
          <button type="submit" className="w-full text-left p-3 rounded-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors uppercase tracking-widest text-[10px] font-black">
            Cerrar Sesión Global
          </button>
        </form>
      </aside>
      <main className="flex-1 min-w-0 p-8 h-screen overflow-y-auto bg-black text-zinc-100 selection:bg-[#ea580c]/30">
        {children}
      </main>
    </div>
  );
}
