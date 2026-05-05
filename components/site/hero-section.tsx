'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type HeroProps = {
  title: string;
  content: string;
  imageUrl?: string | null;
  overline?: string;
};

export function HeroSection({ 
  title, 
  content, 
  imageUrl,
  overline = 'Servicios Especializados'
}: HeroProps) {
  const bgImage = imageUrl || "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=2670&auto=format&fit=crop";

  return (
    <section className="relative w-full min-h-[calc(100svh-80px)] lg:min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* --- CAPA DE EFECTOS INDUSTRIALES (z-0) --- */}
      <div className="absolute inset-0 z-0">
        {/* 1. Imagen optimizada para fondo */}
        <img 
          src={bgImage} 
          alt="Hero Background Servicios Jess" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale blur-[2px] scale-105 mix-blend-luminosity transition-all duration-[3000ms]" 
        />
        
        {/* 2. Overlay Gradiente de Alto Contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900/60 to-neutral-950 z-0" />
        
        {/* 3. Patrón Técnico Radial */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay z-0" 
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #52525B 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      {/* --- CONTENIDO (relative z-10 para estar siempre encima) --- */}
      <div className="relative z-10 w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto flex flex-col items-center md:items-start text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center md:items-start"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6 mix-blend-screen">
            <span className="h-0.5 w-12 bg-[#ea580c] block"></span>
            <span className="text-[#ea580c] font-bold tracking-widest uppercase text-sm">{overline}</span>
          </div>
          
          <h1 className="font-extrabold text-white mb-8 drop-shadow-2xl uppercase text-[clamp(3.2rem,13vw,5.5rem)] sm:text-[clamp(4rem,10vw,6.5rem)] lg:text-[clamp(5rem,6.5vw,7.2rem)] leading-[0.9] tracking-tighter max-w-[11ch] sm:max-w-[12ch] lg:max-w-[10ch] mx-auto md:mx-0">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-neutral-300 mb-10 max-w-xl lg:max-w-2xl font-light leading-relaxed mx-auto md:mx-0">
            {content}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-10">
            <Link 
              href="/contacto" 
              className="bg-[#ea580c] hover:bg-orange-600 text-white px-8 py-4 min-h-[44px] flex items-center justify-center font-bold rounded-sm shadow-[0_0_20px_#ea580c] transition-all hover:shadow-[0_0_25px_#ea580c] text-sm uppercase tracking-widest w-full sm:w-auto"
            >
              Cotizar Proyecto
            </Link>
            
            <Link 
              href="/servicios" 
              className="bg-transparent border border-neutral-600 hover:border-neutral-400 text-white px-8 py-4 min-h-[44px] flex items-center justify-center font-bold rounded-sm transition-colors text-sm uppercase tracking-widest w-full sm:w-auto glass"
            >
              Nuestras Capacidades
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Industrial Accents */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ea580c] via-neutral-800 to-transparent z-20" />
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-[#ea580c] opacity-5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
