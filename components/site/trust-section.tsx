export function TrustSection({ clients }: { clients: any[] }) {
  if (!clients || clients.length === 0) return null;

  // Duplicamos la lista varias veces para asegurar que el carrusel siempre se vea lleno
  const duplicatedClients = [...clients, ...clients, ...clients, ...clients, ...clients, ...clients];

  return (
    <section className="w-full bg-[#050505] py-20 border-y border-white/5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <p className="text-zinc-500 font-bold text-xs tracking-[0.2em] uppercase">
          Empresas que confían en nuestra ingeniería
        </p>
      </div>
      
      {/* Carrusel container con máscara de difuminado en los bordes */}
      <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        
        {/* Track que se anima de forma infinita y pausa en hover */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-16 pr-16">
          {duplicatedClients.map((client, index) => (
            <div 
              key={`${client.id}-${index}`} 
              className="flex items-center justify-center min-w-[160px] h-14 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default"
            >
              {client.logoUrl ? (
                <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="font-black text-xl tracking-tighter text-zinc-300 whitespace-nowrap">
                  {client.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
