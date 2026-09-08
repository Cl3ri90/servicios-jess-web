'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read theme from .public-site or localStorage
    const publicSiteEl = document.querySelector('.public-site');
    const currentAttr = publicSiteEl?.getAttribute('data-theme');
    let activeTheme: 'light' | 'dark' = 'light';

    if (currentAttr === 'dark' || currentAttr === 'light') {
      activeTheme = currentAttr;
    } else {
      const stored = localStorage.getItem('servicios-jess-theme');
      if (stored === 'dark' || stored === 'light') {
        activeTheme = stored;
      }
    }

    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);

    try {
      localStorage.setItem('servicios-jess-theme', nextTheme);
    } catch (e) {
      // localStorage may fail in restricted contexts
    }

    const publicSiteEl = document.querySelector('.public-site');
    if (publicSiteEl) {
      publicSiteEl.setAttribute('data-theme', nextTheme);
    }
  };

  const isDark = theme === 'dark';
  const ariaLabel = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] text-[var(--site-text)] flex items-center justify-center hover:border-[var(--site-primary)] hover:text-[var(--site-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-primary)] transition-colors duration-150 shrink-0 cursor-pointer shadow-sm"
    >
      {/* If not mounted yet, render initial Moon (matching light default) */}
      {!mounted ? (
        <Moon className="w-5 h-5 transition-transform" />
      ) : isDark ? (
        <Sun className="w-5 h-5 text-[var(--site-primary)] transition-transform animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="w-5 h-5 transition-transform animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
}
