'use client';

import { Icon } from '@iconify/react';
import { normalizeIconName } from '@/lib/icons/icon-mapper';
import { cn } from '@/lib/utils';

type DynamicIconProps = {
  icon?: string | null;
  className?: string;
  fallbackIcon?: string;
  colorMode?: 'mono' | 'native';
};

export function DynamicIcon({ 
  icon, 
  className, 
  fallbackIcon = "lucide:circle", 
  colorMode = "mono" 
}: DynamicIconProps) {
  const normalized = normalizeIconName(icon || fallbackIcon);

  return (
    <Icon 
      icon={normalized} 
      className={cn(
        "flex-shrink-0",
        colorMode === "mono" ? "text-current" : "",
        className
      )}
    />
  );
}
