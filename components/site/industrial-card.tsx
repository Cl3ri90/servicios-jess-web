import Link from 'next/link';

type IndustrialCardProps = {
  id: string;
  title: string;
  description: string;
  code?: string;
  href?: string;
  imageUrl?: string | null;
};

export function IndustrialCard({ title, description, code, href, imageUrl }: IndustrialCardProps) {
  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-sm border border-zinc-800/50 glass hover:border-[var(--color-accent)] hover:shadow-[0_0_40px_rgba(234,88,12,0.12)] transition-all">
      
      {/* Upper Block: Image Placeholder or Image */}
      <div className="relative h-[220px] w-full bg-[var(--background)] overflow-hidden border-b border-white/5 group-hover:border-[var(--color-accent)]/30 transition-colors">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" 
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--background)] bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px] opacity-40 group-hover:opacity-80 transition-opacity" />
        )}

        {code && (
          <div className="absolute top-4 left-4 bg-[var(--background)] border border-zinc-800 px-2 py-1">
            <span className="text-[11px] font-mono text-[var(--color-accent)] font-black tracking-widest">{code}</span>
          </div>
        )}
      </div>

      {/* Lower Block */}
      <div className="flex flex-col flex-1 p-8 bg-[var(--background)]/40">
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 tracking-tight group-hover:text-white transition-colors">
          {title}
        </h3>
        
        <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
          {description}
        </p>

        {href ? (
          <Link href={href} className="text-[var(--color-accent)] font-black text-[11px] tracking-widest uppercase flex items-center gap-2 group-hover:text-[var(--color-accent-hover)] transition-colors w-fit pt-2">
            VER ESPECIFICACIONES <span className="text-sm">→</span>
          </Link>
        ) : (
          <button className="text-[var(--color-accent)] font-black text-[11px] tracking-widest uppercase flex items-center gap-2 group-hover:text-[var(--color-accent-hover)] transition-colors w-fit pt-2">
            VER ESPECIFICACIONES <span className="text-sm">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
