'use client';

import { DynamicIcon } from '@/components/shared/dynamic-icon';
import { trackEvent } from '@/lib/analytics/track-event';
import Link from 'next/link';

interface CTAConfig {
  label: string;
  href: string;
  position: string;
  iconName?: string | null;
  backgroundColor: string;
  textColor: string;
  openInNewTab: boolean;
}

export function FloatingCTAClient({ config, isPreview = false }: { config: CTAConfig, isPreview?: boolean }) {
  const handleTrack = () => {
    if (isPreview) return;
    trackEvent({
      type: 'floating_cta_click',
      label: config.label,
      metadata: { href: config.href }
    });
  };

  // Determinar clases de posición (Tailwind CSS)
  let posClasses = "bottom-4 right-4";
  switch(config.position) {
    case 'bottom-left': posClasses = "bottom-4 left-4"; break;
    case 'top-right': posClasses = "top-24 right-4"; break; // Respetamos Navbar superior publico
    case 'top-left': posClasses = "top-24 left-4"; break;
  }

  const isExternal = config.href.startsWith('http') || config.href.startsWith('https') || config.href.startsWith('wa.me') || config.href.startsWith('mailto:');
  const target = (config.openInNewTab || isExternal) ? '_blank' : undefined;
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

  const positionType = isPreview ? "absolute" : "fixed";

  const isNative = config.iconName?.includes(':') && !config.iconName?.startsWith('lucide:') && !config.iconName?.startsWith('mdi:');

  return (
    <div className={`${positionType} z-[999] transition-all duration-300 transform hover:scale-105 ${posClasses}`}>
      {isExternal ? (
        <a 
          href={config.href} 
          target={target} 
          rel={rel}
          onClick={handleTrack}
          className="flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl backdrop-blur-sm border border-white/10 group cursor-pointer"
          style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
        >
           {config.iconName && (
             <DynamicIcon 
              icon={config.iconName} 
              className="w-5 h-5 group-hover:animate-pulse" 
              colorMode={isNative ? 'native' : 'mono'}
             />
           )}
           <span className="font-semibold tracking-wide text-sm">{config.label}</span>
        </a>
      ) : (
        <Link 
          href={config.href} 
          target={target}
          onClick={handleTrack}
          className="flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl backdrop-blur-sm border border-white/10 group"
          style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
        >
           {config.iconName && (
             <DynamicIcon 
              icon={config.iconName} 
              className="w-5 h-5 group-hover:animate-pulse" 
              colorMode={isNative ? 'native' : 'mono'}
             />
           )}
           <span className="font-semibold tracking-wide text-sm">{config.label}</span>
        </Link>
      )}
    </div>
  );
}
