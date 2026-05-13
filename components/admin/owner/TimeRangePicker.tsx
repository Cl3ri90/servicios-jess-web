'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Clock } from 'lucide-react';

const ranges = [
  { label: 'Hoy', value: 'today' },
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
];

export function TimeRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get('range') || '30d';

  const setRange = (range: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', range);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg self-start">
      <div className="px-2 text-zinc-500">
        <Clock className="w-3.5 h-3.5" />
      </div>
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => setRange(r.value)}
          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
            currentRange === r.value
              ? 'bg-[#ea580c] text-white shadow-lg shadow-[#ea580c]/20'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
