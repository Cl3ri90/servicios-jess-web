'use client';

import { parseKpiValue } from '@/lib/kpis/parse-kpi-value';
import { useCountUp } from '@/hooks/use-count-up';
import { useEffect, useRef, useState } from 'react';

export function KpiCard({ value, label, description }: { value: string, label: string, description?: string | null }) {
  const { prefix, num, suffix } = parseKpiValue(value);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const { count, isFinished } = useCountUp(num, 2000, isVisible);

  const displayValue = num !== null ? new Intl.NumberFormat('es-CL').format(count) : value;

  return (
    <div 
      ref={ref}
      className={`relative bg-zinc-950 border rounded-2xl p-8 flex flex-col justify-center transition-all duration-700 overflow-hidden min-w-0 ${
        isFinished 
          ? 'border-zinc-800 shadow-[0_0_24px_rgba(234,88,12,0.18)]' 
          : 'border-white/5'
      }`}
    >
      {/* Top thin border glow indicator */}
      <div 
        className={`absolute top-0 left-0 h-1 bg-[#ea580c] transition-all duration-1000 ease-out ${
          isFinished ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`} 
      />

      <div className="flex items-baseline mb-2 flex-wrap">
        {num !== null && prefix && <span className="text-3xl lg:text-4xl font-light text-zinc-500 mr-1">{prefix}</span>}
        <span className="text-5xl lg:text-6xl font-black text-white tabular-nums tracking-tight">
          {displayValue}
        </span>
        {num !== null && suffix && <span className="text-3xl lg:text-4xl font-bold text-[#ea580c] ml-1">{suffix}</span>}
      </div>
      
      <div className="flex flex-col gap-1 mt-2">
        <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
          {label}
        </h4>
        {description && (
          <p className="text-xs text-zinc-500 mt-2 font-light leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Decorative HUD lines */}
      <div className="absolute bottom-4 right-4 flex gap-1 opacity-20">
        <div className={`w-1 h-1 bg-white rounded-full transition-opacity ${isFinished ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`w-1 h-1 bg-[#ea580c] rounded-full transition-opacity delay-150 ${isFinished ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </div>
  );
}
