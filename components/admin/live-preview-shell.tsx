'use client';

import { ReactNode } from 'react';
import { Eye } from 'lucide-react';

interface LivePreviewShellProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function LivePreviewShell({ 
  title = "Vista Previa en Vivo", 
  description, 
  children,
  className = ""
}: LivePreviewShellProps) {
  return (
    <div className={`border border-zinc-800 rounded-2xl overflow-hidden bg-black mb-8 ${className}`}>
      <div className="bg-zinc-900/50 p-3 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <span className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase">
            <Eye className="w-3.5 h-3.5" />
            {title}
          </span>
          {description && (
            <p className="text-[10px] text-zinc-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>
      <div className="pointer-events-none relative w-full overflow-hidden" style={{ minHeight: '200px' }}>
        {children}
      </div>
    </div>
  );
}
