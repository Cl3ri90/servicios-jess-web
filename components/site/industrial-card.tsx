import Link from 'next/link';
import { DynamicIcon } from '@/components/shared/dynamic-icon';

type IndustrialCardProps = {
  id?: string;
  title: string;
  description: string;
  code?: string;
  href?: string;
  imageUrl?: string | null;
  iconName?: string | null;
  colorOnHover?: boolean;
};

export function IndustrialCard({
  title,
  description,
  code,
  href,
  imageUrl,
  iconName,
  colorOnHover = false
}: IndustrialCardProps) {
  const cardContent = (
    <div className="group flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-3.5 shadow-sm hover:shadow-md hover:border-[var(--site-primary)] transition-all duration-300 cursor-pointer">
      
      {/* Upper Block: Image container */}
      <div className="relative h-[200px] w-full rounded-xl overflow-hidden bg-[var(--site-surface-secondary)]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${colorOnHover ? '' : ''}`}
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--site-surface-secondary)] flex items-center justify-center">
            <span className="text-xs font-mono text-[var(--site-text-muted)] uppercase tracking-widest">{code || 'SERVICIOS JESS'}</span>
          </div>
        )}

        {/* Icon Badge Top-Left */}
        {iconName ? (
          <div className="absolute top-3 left-3 bg-[var(--site-surface)]/90 backdrop-blur-md border border-[var(--site-border)] w-9 h-9 rounded-lg flex items-center justify-center shadow-sm group-hover:border-[var(--site-primary)] transition-colors">
            <DynamicIcon 
              icon={iconName} 
              className="w-4 h-4 text-[var(--site-primary)]"
              colorMode={iconName.includes(':') && !iconName.startsWith('lucide:') && !iconName.startsWith('mdi:') ? 'native' : 'mono'}
            />
          </div>
        ) : code ? (
          <div className="absolute top-3 left-3 bg-[var(--site-surface)]/90 backdrop-blur-md border border-[var(--site-border)] px-2 py-1 rounded-md shadow-sm">
            <span className="text-[10px] font-mono text-[var(--site-primary)] font-black tracking-widest">{code}</span>
          </div>
        ) : null}
      </div>

      {/* Lower Block: Content */}
      <div className="flex flex-col flex-1 pt-4 px-2 pb-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-[var(--site-text)] tracking-tight group-hover:text-[var(--site-primary)] transition-colors">
            {title}
          </h3>
          <span className="text-[var(--site-text)] group-hover:text-[var(--site-primary)] group-hover:translate-x-1 transition-all text-base font-bold leading-none select-none">
            →
          </span>
        </div>
        
        <p className="text-[var(--site-text-muted)] text-xs sm:text-sm leading-relaxed flex-1 line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
