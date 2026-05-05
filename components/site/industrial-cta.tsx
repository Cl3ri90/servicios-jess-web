import Link from 'next/link';

export function IndustrialCTA() {
  return (
    <section className="w-full py-32 bg-[var(--background)] relative border-y border-white/5 flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow specific to the original requirements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Title exactly mapped to reference "image-1.png" */}
        <h2 className="text-5xl md:text-7xl font-black text-[var(--foreground)] tracking-tighter mb-8 leading-[1.05]">
          ¿Proyectos de Alta Exigencia?
          <span className="block text-[var(--color-accent)] mt-2">Fabricamos las Respuestas.</span>
        </h2>
        
        <p className="text-zinc-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Envíanos tus planos o requerimientos técnicos. Nuestro equipo B2B cotizará y proyectará tu solución metalmecánica en 24 horas.
        </p>

        <Link
          href="/contacto"
          className="inline-flex h-14 items-center justify-center bg-[var(--color-accent)] text-white font-black text-sm tracking-widest uppercase rounded-sm hover:bg-[var(--color-accent-hover)] hover:shadow-[0_0_40px_rgba(234,88,12,0.25)] transition-all duration-300 px-12"
        >
          INICIAR PROYECTO <span className="ml-3 text-2xl font-normal leading-none mb-1">→</span>
        </Link>
      </div>
    </section>
  );
}
