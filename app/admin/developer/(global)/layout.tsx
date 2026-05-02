import { ReactNode } from 'react'
import { requireDeveloper } from '@/lib/auth-guards'
import { logoutAction } from "@/lib/actions/auth"

export default async function DeveloperGlobalLayout({ children }: { children: ReactNode }) {
  // This will redirect to /unauthorized if not a DEVELOPER
  await requireDeveloper()

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a192f] w-full">
      <aside className="w-72 bg-duet-primary h-full shadow-2xl flex flex-col shrink-0 relative overflow-hidden z-20">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="p-8 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-duet-accent to-orange-400 flex items-center justify-center shadow-lg font-black text-white text-xl">
               DS
             </div>
             <div>
                <h1 className="text-xl text-white font-black tracking-tight leading-tight">Duet Solutions</h1>
                <p className="text-[10px] text-duet-accent font-bold uppercase tracking-widest mt-0.5">Command Center</p>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-1.5 relative z-10 mt-4 overflow-y-auto">
          <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 px-4 mt-4">Gestión Global</div>
          
          <a href="/admin/developer" className="px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-3 text-sm font-medium">
             <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center">🏢</div>
             Tenants & Config
          </a>
          <a href="/admin/developer/admins" className="px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-3 text-sm font-medium">
             <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center">👥</div>
             Team & Admins
          </a>
          <a href="/admin/developer/platform-ux" className="px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-3 text-sm font-medium">
             <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center">🎨</div>
             Platform UX
          </a>
        </nav>
        
        <div className="p-6 relative z-10 mt-auto border-t border-white/10 bg-black/20">
          <form action={logoutAction}>
            <button type="submit" className="w-full text-left p-3 rounded-lg text-white/60 hover:text-white hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center gap-3">
              <span className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center">🔒</span>
              Cerrar Sesión Global
            </button>
          </form>
        </div>
      </aside>
      
      <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#f8fafc] dark:bg-[#020817] relative">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  )
}
