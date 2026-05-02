export function CompanySection() {
  return (
    <section className="w-full bg-[#050505] border-b border-zinc-900 border-t">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center p-12 lg:p-24 2xl:p-32">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase">Nuestra Empresa</h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-xl font-medium">
            Integramos soluciones de manufactura pesada. Nuestro estricto control de tolerancias en maestranza está enfocado a mitigar riesgos logísticos y operacionales de nuestros clientes corporativos, asegurando la continuidad de la industria.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="border-l-2 border-[#ea580c] pl-6">
              <span className="block text-4xl font-black text-white tracking-tighter mb-1">24/7</span>
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Soporte Critico</span>
            </div>
            <div className="border-l-2 border-[#ea580c] pl-6">
              <span className="block text-4xl font-black text-white tracking-tighter mb-1">100%</span>
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Precisión CNC</span>
            </div>
          </div>
        </div>

        {/* Right Column - Heavy visual element */}
        <div className="bg-[#141414] border-l border-zinc-900 min-h-[500px] lg:min-h-full flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#050505] opacity-60 mix-blend-multiply z-10 transition-opacity duration-700 group-hover:opacity-40" />
          
          <div className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-[0.6] bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center z-0 transition-transform duration-1000 group-hover:scale-105" />
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] z-20 pointer-events-none" />
          
          <div className="relative z-30 border border-[#ea580c]/50 bg-black/50 backdrop-blur-sm p-4 hidden md:block">
             <span className="text-[#ea580c] font-mono text-[10px] font-bold tracking-[0.3em] uppercase">[ Infraestructura B2B ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
