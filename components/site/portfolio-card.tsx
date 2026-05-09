export interface PortfolioCardProps {
  id: string;
  title: string;
  clientName?: string | null;
  featuredImage?: string | null;
  category?: string | null;
  specs?: string | null;
  pieceType?: string | null;
  material?: string | null;
}

export function PortfolioCard({
  title,
  clientName,
  featuredImage,
  category,
  specs,
  pieceType,
  material,
}: PortfolioCardProps) {
  return (
    <div className="group bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col hover:border-[var(--color-primary)]/50 transition-colors glass w-full">
      <div className="aspect-video relative bg-neutral-950 overflow-hidden mix-blend-luminosity hover:mix-blend-normal transition-all duration-500">
        {featuredImage ? (
          <img 
            src={featuredImage} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
             <p className="text-neutral-500 font-mono text-sm">[ DATA FOTOGRÁFICA RESERVADA ]</p>
          </div>
        )}
        {category && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-neutral-700 text-xs px-2 py-1 uppercase tracking-widest text-[var(--color-primary)] font-semibold">
            {category}
          </div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-white mb-2">
          {title}
        </h3>
        {clientName && (
          <p className="text-[var(--color-primary)] text-sm font-semibold tracking-wider uppercase mb-4">
            Cliente: {clientName}
          </p>
        )}
        <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6 flex-1">
          {specs || 'Sin especificación pública detallada.'}
        </p>
        {(pieceType || material) && (
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-neutral-800">
            {pieceType && <span className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded">{pieceType}</span>}
            {material && <span className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded">{material}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
