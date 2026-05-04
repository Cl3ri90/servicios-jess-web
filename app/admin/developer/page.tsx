import { validateAdminAccess } from '@/lib/admin/permissions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import * as Icons from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DeveloperDashboard() {
  await validateAdminAccess('DEVELOPER');

  // Multi-queries concurrentes para rendimiento
  const [
    capTotal, capActive,
    portTotal, portActive,
    sheetTotal, sheetActive,
    leadTotal, flagTotal, flagActive, flagOwner, flagPublic,
    siteConfig, ctaConfig, latestFlags
  ] = await Promise.all([
    prisma.serviceCapability.count(),
    prisma.serviceCapability.count({ where: { isActive: true } }),
    prisma.portfolio.count(),
    prisma.portfolio.count({ where: { isActive: true } }),
    prisma.technicalSheet.count(),
    prisma.technicalSheet.count({ where: { isActive: true } }),
    prisma.lead.count(),
    prisma.featureFlag.count(),
    prisma.featureFlag.count({ where: { isActive: true } }),
    prisma.featureFlag.count({ where: { ownerVisible: true } }),
    prisma.featureFlag.count({ where: { publicVisible: true } }),
    prisma.siteConfig.findUnique({ where: { id: 'singleton' } }),
    prisma.floatingCTA.findUnique({ where: { id: 'floating-cta' } }),
    prisma.featureFlag.findMany({ 
      orderBy: { updatedAt: 'desc' }, 
      take: 5 
    })
  ]);

  const MetricCard = ({ title, value, sub, icon: Icon, color }: any) => (
     <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between group hover:border-zinc-700 hover:shadow-lg transition">
        <div>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
           <h3 className="text-3xl font-black text-white font-mono">{value}</h3>
           {sub && <p className="text-[10px] text-zinc-600 font-mono mt-1">{sub}</p>}
        </div>
        <div className={`p-4 rounded-xl bg-zinc-900 shadow-inner group-hover:scale-110 transition-transform ${color || 'text-zinc-500'}`}>
           <Icon className="w-6 h-6" />
        </div>
     </div>
  );

  const Shortcut = ({ label, href, icon: Icon, isDevOnly }: any) => (
     <Link href={href} className="flex flex-col items-center justify-center gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-500 text-zinc-400 transition-all group">
        <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold text-center tracking-wide">{label}</span>
        {isDevOnly && <span className="absolute top-2 right-2 flex w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
     </Link>
  );

  return (
    <div className="space-y-8 max-w-7xl pb-20">
      <header className="border-b border-zinc-800 pb-6">
        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                 Command Center
                 <span className="text-xs font-mono px-2 py-1 bg-zinc-100 text-black font-black uppercase rounded-md ml-2">
                   DEVELOPER
                 </span>
              </h1>
              <p className="text-zinc-400 mt-2 font-medium">
                Resumen técnico y operativo de Servicios Jess. Infraestructura Single-Tenant Activa.
              </p>
           </div>
           
           <div className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs text-zinc-300 font-mono uppercase font-bold tracking-widest cursor-default">System Health: OK</span>
           </div>
        </div>
      </header>

      {/* MÉTRICAS PRINCIPALES */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <MetricCard title="Capacidades" value={capTotal} sub={`${capActive} Activas • Pub`} icon={Icons.Hammer} color="text-orange-500" />
         <MetricCard title="Portafolio" value={portTotal} sub={`${portActive} Proyectos Vivos`} icon={Icons.FolderOpen} color="text-[#ea580c]" />
         <MetricCard title="Fichas Técnicas" value={sheetTotal} sub={`${sheetActive} Indexadas para Pub`} icon={Icons.FileText} color="text-purple-500" />
         <MetricCard title="Leads Captados" value={leadTotal} sub="Total Histórico" icon={Icons.Users} color="text-green-500" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* COLUMNA IZQUIERDA (2 Espacios) */}
         <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-sm font-black text-white uppercase mb-4 tracking-widest border-b border-zinc-800 pb-2">Topología de Módulos (Flags)</h2>
              <div className="grid grid-cols-3 gap-4">
                 <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-white font-mono">{flagActive} / {flagTotal}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Motores Activos</p>
                 </div>
                 <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-white font-mono">{flagOwner}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Para Owner</p>
                 </div>
                 <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-white font-mono">{flagPublic}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Render Público</p>
                 </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-white uppercase mb-4 tracking-widest border-b border-zinc-800 pb-2">Rutas Estratégicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                 <Shortcut label="Feature Flags" href="/admin/developer/flags" icon={Icons.ToggleRight} isDevOnly />
                 <Shortcut label="Ident. Empresa" href="/admin/developer/empresa" icon={Icons.Home} isDevOnly />
                 <Shortcut label="Config. Global" href="/admin/owner/config" icon={Icons.Settings} />
                 <Shortcut label="Capacidades" href="/admin/owner/capacidades" icon={Icons.Wrench} />
                 <Shortcut label="Portafolio" href="/admin/owner/portafolio" icon={Icons.Image} />
                 <Shortcut label="SEO Core" href="/admin/developer/seo" icon={Icons.Search} isDevOnly />
                 <Shortcut label="Botón Flotante CTA" href="/admin/developer/cta-flotante" icon={Icons.MessageCircle} isDevOnly />
                 <Shortcut label="Catálogo Fichas" href="/admin/developer/catalogo-fichas" icon={Icons.FileArchive} isDevOnly />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-white uppercase mb-4 tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
                 <Icons.BarChart3 className="w-4 h-4" /> Analítica del Sitio
              </h2>
              <div className="border border-dashed border-zinc-800 p-12 rounded-2xl flex flex-col items-center justify-center text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-zinc-950/50">
                 <Icons.Radar className="w-10 h-10 text-zinc-700 animate-pulse mb-4" />
                 <p className="text-zinc-300 font-bold mb-1">Analítica pendiente de integración</p>
                 <p className="text-xs text-zinc-500 max-w-sm">No hay tracking de Pageviews, Usuarios Únicos o Tasas de Conversión conectados con Prisma aún. Extensión planificada.</p>
              </div>
            </section>
         </div>

         {/* COLUMNA DERECHA (Panel Info) */}
         <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
               <div className="bg-zinc-900 border-b border-zinc-800 p-4">
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">
                     <Icons.Server className="w-4 h-4 text-orange-500" />
                     Snapshot Config
                  </h3>
               </div>
               <div className="p-0">
                  <ul className="divide-y divide-zinc-800/50 flex flex-col font-mono text-xs">
                     <li className="flex justify-between items-center px-4 py-3 bg-zinc-900/20">
                        <span className="text-zinc-500">Mantenimiento:</span>
                        {siteConfig?.isMaintenance ? <span className="text-red-500 font-bold">ACTIVO</span> : <span className="text-green-500">INACTIVO</span>}
                     </li>
                     <li className="flex justify-between items-center px-4 py-3">
                        <span className="text-zinc-500">Hero BG Image:</span>
                        {siteConfig?.heroBgUrl ? <span className="text-zinc-300">Configurado</span> : <span className="text-yellow-600">Pendiente</span>}
                     </li>
                     <li className="flex justify-between items-center px-4 py-3 bg-zinc-900/20">
                        <span className="text-zinc-500">Logo App:</span>
                        {siteConfig?.logoUrl ? <span className="text-zinc-300">Alojado Storage</span> : <span className="text-yellow-600">Faltante</span>}
                     </li>
                     <li className="flex justify-between items-center px-4 py-3">
                        <span className="text-zinc-500">CTA Adhesivo:</span>
                        {ctaConfig?.enabled ? <span className="text-green-500 font-bold tracking-widest">ON</span> : <span className="text-zinc-600 tracking-widest">OFF</span>}
                     </li>
                  </ul>
               </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
               <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center">
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">
                     <Icons.Activity className="w-4 h-4 text-[#ea580c]" />
                     Actividad System Flags
                  </h3>
               </div>
               <div className="p-4 space-y-4">
                  {latestFlags.length > 0 ? latestFlags.map(flag => (
                    <div key={flag.id} className="flex justify-between items-start border-l-2 border-zinc-800 pl-3 py-1">
                       <div>
                          <p className="text-white text-sm font-medium">{flag.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono tracking-wider">{flag.key}</p>
                       </div>
                       <span className="text-[10px] text-zinc-600 select-none">
                          {flag.updatedAt.toLocaleDateString()}
                       </span>
                    </div>
                  )) : (
                     <div className="text-center py-6">
                        <p className="text-xs text-zinc-500 font-mono">Sin actividad reciente registrada.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
