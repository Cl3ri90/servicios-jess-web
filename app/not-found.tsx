import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center selection:bg-[var(--color-primary)]/30">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neutral-800/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-xl">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase border border-neutral-800 text-neutral-500 rounded-sm">
          Error 404 • Recurso No Encontrado
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase">
          Fuera de <br />
          <span className="text-[var(--color-primary)]">Rango.</span>
        </h1>
        
        <p className="text-xl text-neutral-400 font-light mb-12 leading-relaxed">
          La página que buscas no existe. Si crees que esto es un error de configuración técnica, contacta al soporte operativo B2B.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="px-10 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)]"
          >
            Volver al Inicio
          </Link>
          <Link 
            href="/admin" 
            className="px-10 py-4 border border-neutral-800 hover:bg-neutral-900 text-white font-bold uppercase tracking-widest text-sm transition-all"
          >
            Panel Comando
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-full text-center">
        <span className="text-[10px] font-black font-mono text-neutral-800 uppercase tracking-[0.5em]">
          Single Tenant Protocol v2.0 • System Secure
        </span>
      </div>
    </div>
  );
}
