'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavbarProps = {
  brandName: string;
  logoUrl?: string | null;
  activeFlags: string[];
};

export function Navbar({ brandName, logoUrl, activeFlags }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'INICIO', path: '/' },
    { name: 'EMPRESA', path: '/empresa' },
    { name: 'SERVICIOS', path: '/servicios', flag: 'capacidades' },
    { name: 'PORTAFOLIO', path: '/portafolio', flag: 'portafolio' },
    { name: 'CONTACTO', path: '/contacto' },
  ].filter(item => !item.flag || activeFlags.includes(item.flag));

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-accent)] z-[60]" />
      
      <header 
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'glass border-white/10 shadow-xl' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName ?? "Servicios Jess"}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <>
                <div className="w-10 h-8 rounded-sm overflow-hidden relative bg-[var(--color-primary)] border border-white/10 flex items-center justify-center transform -skew-x-12">
                   <span className="text-white font-black text-sm italic skew-x-12 tracking-tighter">SJ</span>
                </div>
                <span className="font-extrabold text-white tracking-[0.1em] text-lg uppercase hidden sm:block">
                  {brandName}
                </span>
              </>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[11px] font-bold tracking-[0.22em] transition-colors uppercase ${
                    isActive 
                      ? 'text-[#ea580c] border-b-2 border-[#ea580c]' 
                      : 'text-zinc-400 hover:text-[#ea580c]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex flex-row items-center gap-4">
            <Link 
              href="/contacto" 
              className="h-10 px-6 bg-[var(--color-accent)] text-white font-black text-[11px] uppercase tracking-[0.22em] hover:bg-[var(--color-accent-hover)] transition-colors rounded-sm flex items-center justify-center"
            >
              INICIAR PROYECTO
            </Link>
          </div>

          <button 
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            className="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] text-zinc-400 hover:text-[#ea580c]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-md pt-24 px-6 pb-6 overflow-y-auto lg:hidden flex flex-col">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-bold tracking-[0.2em] transition-colors uppercase py-3 px-2 flex items-center min-h-[44px] border-b border-white/10 ${
                    isActive 
                      ? 'text-[#ea580c]' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link 
              href="/contacto" 
              onClick={() => setIsOpen(false)}
              className="mt-6 h-14 w-full bg-[#ea580c] text-white font-black text-sm uppercase tracking-[0.22em] hover:bg-orange-600 transition-colors rounded-sm flex items-center justify-center shadow-lg"
            >
              INICIAR PROYECTO
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
