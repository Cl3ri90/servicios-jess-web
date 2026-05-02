import { getCurrentProfile } from "@/lib/db/profile";
import { prisma } from "@/lib/prisma";
import { FeatureFlagSwitch } from "@/components/admin/feature-flag-switch";
import { ShieldAlert } from 'lucide-react';

export default async function OwnerDashboard() {
  const profile = await getCurrentProfile();
  const isDeveloper = profile?.role === 'DEVELOPER';
  
  const flags = await prisma.featureFlag.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="space-y-6 max-w-[1200px] mb-20">
      <header className="border-b border-zinc-800 pb-6 mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase text-[#ea580c]">Panel de Control Operativo</h1>
        <p className="text-zinc-400 mt-2 font-medium">
          Bienvenido {profile?.name || profile?.email || 'Operador'}. Control de características y despliegues del sistema.
        </p>
      </header>

      {isDeveloper && (
        <div className="bg-[#ea580c]/10 border border-[#ea580c]/20 p-4 rounded-sm mb-8 flex gap-3 text-sm font-mono items-center shadow-lg">
          <ShieldAlert className="w-5 h-5 text-[#ea580c]" />
          <span className="text-[#ea580c]">Modo Developer activo: visualizas todos los módulos, incluso los desactivados para Owner.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {flags.map((flag: any) => {
          if (!isDeveloper && !flag.ownerVisible) return null;

          return (
            <div key={flag.id} className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col gap-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#ea580c]/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#ea580c]/10 transition-colors" />
               
               <div>
                 <h3 className="text-lg font-black text-white uppercase tracking-wider">{flag.name}</h3>
                 <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 mt-2 inline-block rounded-sm uppercase tracking-widest">{flag.key}</span>
               </div>

               <div className="flex flex-col gap-4 relative z-10 flex-1 justify-end">
                 
                 <div className="flex items-center justify-between border-b border-zinc-800/50 pb-3">
                   <div className="text-sm text-zinc-400 uppercase tracking-widest text-[10px] font-bold">Estado del Módulo</div>
                   {isDeveloper ? (
                     <FeatureFlagSwitch flagKey={flag.key} field="isActive" initialValue={flag.isActive} />
                   ) : (
                     <span className={`px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${flag.isActive ? 'bg-[#ea580c]/20 text-[#ea580c] border border-[#ea580c]/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                       {flag.isActive ? 'Activo' : 'Inactivo'}
                     </span>
                   )}
                 </div>

                 <div className="flex items-center justify-between border-b border-zinc-800/50 pb-3">
                   <div className="text-sm text-zinc-400 uppercase tracking-widest text-[10px] font-bold">Visible Frontend Público</div>
                   {isDeveloper ? (
                     <FeatureFlagSwitch flagKey={flag.key} field="publicVisible" initialValue={flag.publicVisible} />
                   ) : (
                     <span className={`px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${flag.publicVisible ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                       {flag.publicVisible ? 'Público' : 'Oculto'}
                     </span>
                   )}
                 </div>

                 <div className="flex items-center justify-between border-b border-zinc-800/50 pb-3">
                   <div className="text-sm text-zinc-400 uppercase tracking-widest text-[10px] font-bold">Visible a Owner</div>
                   {isDeveloper ? (
                     <FeatureFlagSwitch flagKey={flag.key} field="ownerVisible" initialValue={flag.ownerVisible} />
                   ) : (
                     <span className={`px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${flag.ownerVisible ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                       {flag.ownerVisible ? 'Sidebar' : 'Bloqueado'}
                     </span>
                   )}
                 </div>

                 <div className="flex items-center justify-between">
                   <div className="text-sm text-zinc-400 uppercase tracking-widest text-[10px] font-bold">Editable por Owner</div>
                   {isDeveloper ? (
                     <FeatureFlagSwitch flagKey={flag.key} field="ownerEditable" initialValue={flag.ownerEditable} />
                   ) : (
                     <span className={`px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${flag.ownerEditable ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                       {flag.ownerEditable ? 'Escritura' : 'Solo Lectura'}
                     </span>
                   )}
                 </div>

               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
