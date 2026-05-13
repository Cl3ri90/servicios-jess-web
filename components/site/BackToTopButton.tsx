'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // No mostrar en el panel administrativo
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timeout) return;

      timeout = setTimeout(() => {
        setIsVisible(window.scrollY > 400);
        timeout = null;
      }, 100); // Throttle 100ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      // Fallback para navegadores antiguos
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      onClick={scrollToTop}
      type="button"
      aria-label="Volver arriba"
      title="Volver arriba"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-24 right-6 z-40 p-3 rounded-xl bg-[#ea580c] text-white shadow-lg transition-all duration-300 transform border border-white/10 hover:bg-orange-500 hover:scale-110 active:scale-95 ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
