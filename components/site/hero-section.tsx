'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics/track-event';

type HeroProps = {
  title: string;
  content: string;
  imageUrl?: string | null;
  overline?: string;
  btnText?: string;
  btnLink?: string;
  secBtnText?: string;
  secBtnLink?: string;
};

export function HeroSection({ 
  title, 
  content, 
  imageUrl,
  overline = 'Servicios Especializados',
  btnText = 'Cotizar proyecto',
  btnLink = '/contacto',
  secBtnText = 'Ver capacidades',
  secBtnLink = '/servicios'
}: HeroProps) {
  const bgImage = imageUrl || "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=2670&auto=format&fit=crop";

  // Destacar el caracter '&' con el color principal si está presente
  const renderTitle = (rawTitle: string) => {
    if (!rawTitle.includes('&')) {
      return rawTitle;
    }
    const parts = rawTitle.split('&');
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <span className="text-[var(--site-primary)] mx-1">&</span>
        )}
      </span>
    ));
  };

  return (
    <section className="relative w-full overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            {/* Overline con barra diagonal */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--site-primary)] font-black text-xl leading-none select-none">/</span>
              <span className="text-[var(--site-primary)] font-extrabold tracking-[0.16em] uppercase text-xs sm:text-sm">
                {overline}
              </span>
            </div>
            
            {/* Título Principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.85rem] font-black tracking-tight leading-[1.06] text-[var(--site-text)] mb-5">
              {renderTitle(title)}
            </h1>

            {/* Subtítulo / Descripción */}
            <p className="text-base sm:text-lg text-[var(--site-text-muted)] font-normal leading-relaxed mb-8 max-w-xl">
              {content}
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {btnText && (
                <Link
                  href={btnLink || '/contacto'}
                  onClick={() => trackEvent({ type: 'cta_click', label: btnText, metadata: { href: btnLink } })}
                  className="h-12 px-7 bg-[var(--site-primary)] text-white font-bold text-sm tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{btnText}</span>
                  <span className="text-base font-black leading-none">→</span>
                </Link>
              )}

              {secBtnText && (
                <Link
                  href={secBtnLink || '/servicios'}
                  onClick={() => trackEvent({ type: 'cta_click', label: secBtnText, metadata: { href: secBtnLink } })}
                  className="h-12 px-7 bg-[var(--site-surface)] text-[var(--site-text)] border border-[var(--site-border)] font-bold text-sm tracking-wider uppercase rounded-lg hover:border-[var(--site-primary)] transition-colors flex items-center justify-center shadow-sm"
                >
                  <span>{secBtnText}</span>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Columna Derecha: Imagen Industrial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-6 w-full relative"
          >
            <div className="relative w-full rounded-2xl lg:rounded-3xl overflow-hidden lg:[clip-path:polygon(9%_0,100%_0,100%_100%,0%_100%)] shadow-md border border-[var(--site-border)]/60 bg-[var(--site-surface)]">
              {/* Badge decorativo superior derecho */}
              <div className="absolute top-5 right-5 z-10 hidden sm:flex items-center gap-2 bg-[var(--site-surface)]/85 backdrop-blur-md px-3 py-1.5 rounded-md border border-[var(--site-border)]/80 shadow-sm">
                <span className="text-[var(--site-primary)] font-black text-sm">/</span>
                <span className="text-[10px] font-black tracking-[0.14em] text-[var(--site-text)] uppercase">
                  MATERIALES QUE IMPULSAN LA INDUSTRIA
                </span>
              </div>

              <img
                src={bgImage}
                alt={title}
                className="w-full h-[320px] sm:h-[400px] lg:h-[460px] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
