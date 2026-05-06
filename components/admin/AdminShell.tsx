'use client';

import { ReactNode, useState, useEffect } from 'react';
import { SidebarNav } from '@/components/admin/SidebarNav';
import { logoutAction } from '@/lib/actions/auth';
import type { AdminMenuLink } from '@/lib/admin/menu';
import { Menu, X } from 'lucide-react';

type AdminShellProps = {
  children: ReactNode;
  role: 'DEVELOPER' | 'OWNER';
  links: AdminMenuLink[];
  title: string;
  subtitle: string;
  basePath: string;
  logoUrl?: string | null;
};

export function AdminShell({ children, role, links, title, subtitle, basePath, logoUrl }: AdminShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black font-sans relative">
      
      {/* Mobile Topbar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-zinc-950 border-b border-zinc-800 p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="admin-sidebar"
            aria-label="Abrir menú"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          {logoUrl ? (
            <img src={logoUrl} alt={title} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-[#ea580c] font-black uppercase tracking-tight">{title}</span>
          )}
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        id="admin-sidebar"
        inert={isMobile && !isOpen ? true : undefined}
        className={`fixed inset-y-0 left-0 z-50 w-[82vw] max-w-80 bg-zinc-950 p-6 flex flex-col gap-6 shrink-0 border-r border-zinc-800 justify-between transition-transform duration-300 lg:static lg:translate-x-0 lg:w-64 lg:z-0 lg:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
            <div className="flex items-start justify-between min-h-[48px]">
              <div className="flex flex-col gap-1 w-full pr-2">
                {logoUrl ? (
                  <div className="h-10 w-full flex items-center justify-start">
                    <img src={logoUrl} alt={title} className="h-8 w-auto object-contain" />
                  </div>
                ) : (
                  <h1 className="text-xl text-[#ea580c] font-black uppercase tracking-tight leading-none">{title}</h1>
                )}
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono leading-none">{subtitle}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div onClick={() => { if(isMobile) setIsOpen(false) }} className="flex-1 overflow-y-auto">
              <SidebarNav 
                basePath={basePath} 
                isDeveloper={role === 'DEVELOPER'}
                links={links}
              />
            </div>
        </div>
        <form action={logoutAction} className="mt-auto">
          <button type="submit" className="w-full text-left px-3 py-3 min-h-[44px] rounded-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors uppercase tracking-widest text-[10px] font-black">
            Cerrar Sesión
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden overflow-y-auto lg:h-screen bg-black text-zinc-100 selection:bg-[#ea580c]/30 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
