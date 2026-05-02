export function TrustSection() {
  return (
    <section className="w-full bg-white py-24 border-b border-zinc-100 relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-zinc-400 font-semibold text-sm tracking-widest uppercase mb-12">
          Hacen posible sus operaciones gracias a nosotros
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg"></div>
            <span className="font-black text-2xl tracking-tighter text-zinc-900">NEXUS</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-[6px] border-zinc-800"></div>
            <span className="font-extrabold text-2xl tracking-tight text-zinc-900">AERODYNE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-zinc-800 transform rotate-45"></div>
            <span className="font-black text-2xl tracking-tighter text-zinc-900">MINETEC</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-3 bg-zinc-800"></div>
            <span className="font-extrabold text-xl tracking-widest text-zinc-900 uppercase">Logistics</span>
          </div>
        </div>
      </div>
    </section>
  );
}
