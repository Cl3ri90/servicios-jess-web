'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function IconPicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (iconName: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const icons = useMemo(() => {
    return Object.keys(LucideIcons).filter(
      name => name !== 'createLucideIcon' && 
              name !== 'default' && 
              name !== 'LucideProps' && 
              name !== 'Icon' && 
              !name.endsWith('Context') && 
              typeof (LucideIcons as any)[name] !== 'undefined'
    );
  }, []);

  const filteredIcons = useMemo(() => {
    if (!search) return icons.slice(0, 50);
    return icons
      .filter(name => name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 50);
  }, [icons, search]);

  const CurrentIcon = value && (LucideIcons as any)[value] ? (LucideIcons as any)[value] : LucideIcons.Wrench;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input type="hidden" name="iconName" value={value} />
      <Button 
        variant="outline" 
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full justify-start border-zinc-800 bg-zinc-950 text-left font-normal text-white hover:bg-zinc-900 hover:text-white"
      >
        <CurrentIcon className="mr-2 h-4 w-4 text-[#ea580c]" />
        {value || 'Seleccionar ícono...'}
      </Button>
      
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 shadow-xl overflow-hidden">
          <div className="p-2 border-b border-zinc-800">
             <Input 
               placeholder="Buscar ícono..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="h-8 border-zinc-800 bg-black text-white focus-visible:ring-1 focus-visible:ring-[#ea580c]"
             />
          </div>
          <div className="h-[200px] p-2 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
              {filteredIcons.map((iconName) => {
                const Icon = (LucideIcons as any)[iconName];
                if (!Icon) return null;
                return (
                  <button
                    type="button"
                    key={iconName}
                    className={`h-10 w-full flex items-center justify-center rounded-md hover:bg-zinc-800 hover:text-[#ea580c] transition-colors ${value === iconName ? 'bg-zinc-800 text-[#ea580c]' : 'text-zinc-400'}`}
                    onClick={() => {
                      onChange(iconName);
                      setOpen(false);
                    }}
                    title={iconName}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
            {filteredIcons.length === 0 && (
              <p className="p-4 text-center text-xs text-zinc-500">No se encontraron íconos.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
