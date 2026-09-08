'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics/track-event';
import { ThemeToggle } from './theme-toggle';

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
      <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--site-primary)] z-[60]" />
      
      <header 
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-[var(--site-header)]/95 backdrop-blur-md border-[var(--site-border)] shadow-sm'
            : 'bg-[var(--site-header)] border-[var(--site-border)]'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group h-12">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName ?? "Servicios Jess"}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            ) : (
              <>
                <div className="w-10 h-8 rounded-md overflow-hidden relative bg-[var(--site-primary)] border border-white/10 flex items-center justify-center transform -skew-x-12">
                   <span className="text-white font-black text-sm italic skew-x-12 tracking-tighter">SJ</span>
                </div>
                <span className="font-extrabold text-[var(--site-text)] tracking-[0.1em] text-lg uppercase hidden sm:block">
                  {brandName}
                </span>
              </>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[12px] font-extrabold tracking-[0.2em] transition-colors uppercase ${
                    isActive 
                      ? 'text-[var(--site-primary)] border-b-2 border-[var(--site-primary)] pb-1'
                      : 'text-[var(--site-text-muted)] hover:text-[var(--site-primary)]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex flex-row items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/contacto" 
              onClick={() => trackEvent({ type: 'cta_click', label: 'INICIAR PROYECTO', metadata: { component: 'navbar' } })}
              className="h-11 px-6 bg-[var(--site-primary)] text-white font-extrabold text-[12px] uppercase tracking-[0.18em] hover:opacity-90 transition-opacity rounded-lg flex items-center justify-center gap-2 shadow-sm"
            >
              <span>INICIAR PROYECTO</span>
              <span className="text-sm font-black leading-none">→</span>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] text-[var(--site-text-muted)] hover:text-[var(--site-primary)]"
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
        </div>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 bg-[var(--site-header)] pt-24 px-6 pb-6 overflow-y-auto lg:hidden flex flex-col border-b border-[var(--site-border)] shadow-xl">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold tracking-[0.15em] transition-colors uppercase py-3 px-2 flex items-center min-h-[44px] border-b border-[var(--site-border)] ${
                    isActive 
                      ? 'text-[var(--site-primary)]'
                      : 'text-[var(--site-text-muted)] hover:text-[var(--site-text)]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link 
              href="/contacto" 
              onClick={() => {
                setIsOpen(false);
                trackEvent({ type: 'cta_click', label: 'INICIAR PROYECTO', metadata: { component: 'mobile_navbar' } });
              }}
              className="mt-6 h-12 w-full bg-[var(--site-primary)] text-white font-black text-sm uppercase tracking-[0.18em] hover:opacity-90 transition-opacity rounded-lg flex items-center justify-center gap-2 shadow-md"
            >
              <span>INICIAR PROYECTO</span>
              <span className="text-base font-black leading-none">→</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
