import Link from 'next/link';
import { DynamicIcon } from '@/components/shared/dynamic-icon';

type IndustrialCardProps = {
  id: string;
  title: string;
  description: string;
  code?: string;
  href?: string;
  imageUrl?: string | null;
  iconName?: string | null;
};

export function IndustrialCard({ title, description, code, href, imageUrl, iconName }: IndustrialCardProps) {
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

        {iconName ? (
          <div className="absolute top-4 left-4 bg-[var(--background)]/80 backdrop-blur-sm border border-zinc-800 p-2 rounded-sm group-hover:border-[var(--color-accent)] transition-colors">
            <DynamicIcon 
              icon={iconName} 
              className="w-5 h-5 text-[var(--color-accent)]" 
              colorMode={iconName.includes(':') && !iconName.startsWith('lucide:') && !iconName.startsWith('mdi:') ? 'native' : 'mono'}
            />
          </div>
        ) : code ? (
          <div className="absolute top-4 left-4 bg-[var(--background)] border border-zinc-800 px-2 py-1">
            <span className="text-[11px] font-mono text-[var(--color-accent)] font-black tracking-widest">{code}</span>
          </div>
        ) : null}
      </div>

      {/* Lower Block */}
      <div className="flex flex-col flex-1 p-8 bg-[var(--background)]/40">
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 tracking-tight group-hover:text-white transition-colors">
          {title}
        </h3>
        
        <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">
          {description}
        </p>
      </div>
    </div>
  );
}
