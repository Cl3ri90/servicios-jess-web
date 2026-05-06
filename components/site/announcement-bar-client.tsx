'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export interface AnnouncementBarProps {
  text: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  bgColor?: string;
  textColor?: string;
  dismissible?: boolean;
  isPreview?: boolean;
}

export function AnnouncementBarClient({
  text,
  ctaText,
  ctaUrl,
  bgColor = '#ea580c',
  textColor = '#ffffff',
  dismissible = false,
  isPreview = false,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible && !isPreview) return null;

  return (
    <div
      className={`w-full py-3 px-4 flex items-center justify-center gap-4 text-sm font-medium z-50 ${
        isPreview ? 'relative rounded-lg shadow-xl' : 'relative'
      }`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex-1 max-w-7xl mx-auto flex items-center justify-center gap-4 text-center">
        <span>{text}</span>
        {ctaText && ctaUrl && (
          <Link
            href={ctaUrl}
            className="underline font-bold whitespace-nowrap hover:opacity-80 transition-opacity"
            onClick={(e) => {
              if (isPreview) e.preventDefault();
            }}
          >
            {ctaText} →
          </Link>
        )}
      </div>

      {dismissible && (
        <button
          onClick={() => {
            if (!isPreview) setIsVisible(false);
          }}
          className="absolute right-4 hover:bg-black/10 p-1 rounded-full transition-colors"
          aria-label="Cerrar anuncio"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
