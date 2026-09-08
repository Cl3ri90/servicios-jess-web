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
      className={`relative rounded-2xl p-5 lg:p-6 flex flex-col justify-center items-center text-center transition-all duration-700 overflow-hidden min-w-0 h-full backdrop-blur-sm ${
        isFinished 
          ? 'bg-[var(--site-surface)] border border-[var(--site-border)] shadow-sm'
          : 'bg-[var(--site-surface)]/50 border border-[var(--site-border)]/50'
      }`}
    >
      {/* Top thin border glow indicator - Centered tab */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-[var(--site-primary)] transition-all duration-1000 ease-out ${
          isFinished ? 'w-[24px] opacity-100' : 'w-0 opacity-0'
        }`} 
      />

      <div className="flex items-baseline mb-1 flex-wrap justify-center">
        {num !== null && prefix && <span className="text-2xl lg:text-3xl font-light text-[var(--site-text-muted)] mr-1">{prefix}</span>}
        <span className="text-4xl lg:text-5xl font-black text-[var(--site-text)] tabular-nums tracking-tight">
          {displayValue}
        </span>
        {num !== null && suffix && <span className="text-2xl lg:text-3xl font-bold text-[var(--site-primary)] ml-1">{suffix}</span>}
      </div>
      
      <div className="flex flex-col gap-1 mt-1">
        <h4 className="text-xs lg:text-sm font-semibold uppercase tracking-[0.15em] text-[var(--site-text-muted)]">
          {label}
        </h4>
        {description && (
          <p className="text-[11px] text-[var(--site-text-muted)] mt-1 font-normal leading-relaxed max-w-[220px]">
            {description}
          </p>
        )}
      </div>

      {/* Decorative HUD lines */}
      <div className="absolute bottom-3 right-3 flex gap-1 opacity-20">
        <div className={`w-1 h-1 bg-[var(--site-text)] rounded-full transition-opacity ${isFinished ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`w-1 h-1 bg-[var(--site-primary)] rounded-full transition-opacity delay-150 ${isFinished ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </div>
  );
}
