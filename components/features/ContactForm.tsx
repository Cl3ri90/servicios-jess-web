'use client';

export function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-widest block mb-1">Nombre Completo</label>
          <input type="text" className="w-full bg-neutral-950 border border-neutral-800 p-4 font-medium text-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-widest block mb-1">Empresa</label>
          <input type="text" className="w-full bg-neutral-950 border border-neutral-800 p-4 font-medium text-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-widest block mb-1">Correo Corporativo</label>
          <input type="email" className="w-full bg-neutral-950 border border-neutral-800 p-4 font-medium text-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-widest block mb-1">Teléfono Directo</label>
          <input type="text" className="w-full bg-neutral-950 border border-neutral-800 p-4 font-medium text-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-white uppercase tracking-widest block mb-1">Detalle Técnico o Requerimiento</label>
        <textarea rows={5} className="w-full bg-neutral-950 border border-neutral-800 p-4 font-medium text-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-none"></textarea>
      </div>

      <div className="pt-6">
        <button type="button" className="w-full py-5 bg-[var(--color-accent)] text-white font-black text-sm tracking-widest uppercase hover:bg-[var(--color-accent-hover)] transition-all flex items-center justify-center gap-3">
          ENVIAR SOLICITUD TÉCNICA
        </button>
      </div>
    </form>
  );
}
