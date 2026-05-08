'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DynamicIcon } from '@/components/shared/dynamic-icon';
import { Loader2, Search, X } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'industrial',
    label: 'Industrial',
    icons: ['mdi:factory', 'mdi:robot-industrial', 'mdi:hammer-wrench', 'fa6-solid:industry', 'tabler:building-factory', 'lucide:factory']
  },
  {
    id: 'tools',
    label: 'Herramientas',
    icons: ['lucide:wrench', 'lucide:hammer', 'lucide:cog', 'tabler:tool', 'tabler:tools', 'mdi:tools']
  },
  {
    id: 'safety',
    label: 'Seguridad',
    icons: ['lucide:shield-check', 'fa6-solid:helmet-safety', 'mdi:hard-hat', 'tabler:shield-check']
  },
  {
    id: 'energy',
    label: 'Energía',
    icons: ['lucide:zap', 'tabler:bolt', 'mdi:lightning-bolt', 'fa6-solid:bolt']
  },
  {
    id: 'contact',
    label: 'Contacto',
    icons: ['lucide:phone', 'lucide:mail', 'lucide:message-circle', 'lucide:send', 'lucide:contact']
  },
  {
    id: 'logos',
    label: 'Logos',
    icons: ['logos:whatsapp-icon', 'logos:linkedin-icon', 'simple-icons:googlemaps', 'simple-icons:google']
  },
  {
    id: 'emojis',
    label: 'Emojis',
    icons: ['fluent-emoji-flat:gear', 'fluent-emoji-flat:hammer-and-wrench', 'fluent-emoji-flat:factory', 'noto:gear', 'noto:factory', 'openmoji:factory']
  }
];

export function IconPicker({ 
  value, 
  onChange,
  placeholder = 'Seleccionar ícono...'
}: { 
  value?: string | null; 
  onChange: (iconName: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('industrial');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced search using Iconify API
  useEffect(() => {
    if (search.length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(search)}&limit=60`);
        const data = await response.json();
        setSearchResults(data.icons || []);
      } catch (error) {
        console.error('Error fetching icons:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

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
      <input type="hidden" name="iconName" value={value || ''} />
      <Button 
        variant="outline" 
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full justify-start border-zinc-800 bg-zinc-950 text-left font-normal text-white hover:bg-zinc-900 hover:text-white group h-11"
      >
        <div className="mr-3 flex items-center justify-center">
          <DynamicIcon 
            icon={value} 
            className="h-5 w-5 text-[#ea580c]" 
            colorMode={value?.includes(':') && !value.startsWith('lucide:') && !value.startsWith('mdi:') ? 'native' : 'mono'}
          />
        </div>
        <span className="truncate">{value || placeholder}</span>
      </Button>
      
      {open && (
        <div className="absolute z-50 mt-2 w-[320px] sm:w-[400px] rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
               <Input 
                 placeholder="Buscar en Iconify (ej: 'factory')..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-9 pr-9 h-10 border-zinc-800 bg-black text-white focus-visible:ring-1 focus-visible:ring-[#ea580c]"
                 autoFocus
               />
               {search && (
                 <button 
                   onClick={() => setSearch('')}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                 >
                   <X className="h-4 w-4" />
                 </button>
               )}
             </div>
          </div>

          <div className="p-1">
            {search.length >= 3 ? (
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500">
                    <Loader2 className="h-6 w-6 animate-spin text-[#ea580c]" />
                    <span className="text-xs font-mono tracking-widest uppercase">Buscando íconos...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="h-full p-2 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-6 gap-1">
                      {searchResults.map((iconName) => (
                        <IconButton 
                          key={iconName} 
                          iconName={iconName} 
                          isSelected={value === iconName}
                          onClick={() => {
                            onChange(iconName);
                            setOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                    No se encontraron resultados.
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full">
                <div className="px-2 pt-2 pb-1 overflow-x-auto flex justify-start gap-1 scrollbar-hide border-b border-zinc-800/50">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.id} 
                        type="button"
                        onClick={() => setActiveTab(cat.id)}
                        className={`px-3 py-1.5 text-[10px] uppercase tracking-tighter font-black border rounded-md whitespace-nowrap transition-all ${activeTab === cat.id ? 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/50' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                </div>
                
                <div className="h-[250px] overflow-y-auto p-2 custom-scrollbar">
                    <div className="grid grid-cols-6 gap-1">
                      {CATEGORIES.find(c => c.id === activeTab)?.icons.map((iconName) => (
                        <IconButton 
                          key={iconName} 
                          iconName={iconName} 
                          isSelected={value === iconName}
                          onClick={() => {
                            onChange(iconName);
                            setOpen(false);
                          }}
                        />
                      ))}
                    </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
            <span className="text-[9px] text-zinc-500 font-mono uppercase truncate max-w-[200px]">
              {value ? `Seleccionado: ${value}` : 'Ningún ícono seleccionado'}
            </span>
            {value && (
              <button 
                onClick={() => onChange('')}
                className="text-[9px] text-[#ea580c] font-black uppercase tracking-widest hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function IconButton({ iconName, isSelected, onClick }: { iconName: string, isSelected: boolean, onClick: () => void }) {
  const isNative = iconName.includes(':') && !iconName.startsWith('lucide:') && !iconName.startsWith('mdi:');
  
  return (
    <button
      type="button"
      className={`h-11 w-full flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-all border-2 ${isSelected ? 'bg-[#ea580c]/10 border-[#ea580c]' : 'border-transparent text-zinc-400 hover:text-white'}`}
      onClick={onClick}
      title={iconName}
    >
      <DynamicIcon 
        icon={iconName} 
        className="h-6 w-6" 
        colorMode={isNative ? 'native' : 'mono'}
      />
    </button>
  );
}
