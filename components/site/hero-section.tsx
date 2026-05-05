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
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center bg-neutral-950 overflow-hidden">
      
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
      <div className="relative z-10 container max-w-[1320px] mx-auto px-6 lg:px-12 flex flex-col items-center md:items-start text-center md:text-left pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6 mix-blend-screen">
            <span className="h-0.5 w-12 bg-[#ea580c] block"></span>
            <span className="text-[#ea580c] font-bold tracking-widest uppercase text-sm">{overline}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8 drop-shadow-2xl uppercase">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-300 mb-10 max-w-2xl font-light">
            {content}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-10">
            <Link 
              href="/contacto" 
              className="bg-[#ea580c] hover:bg-orange-600 text-white px-8 py-4 font-bold rounded-sm shadow-[0_0_20px_#ea580c] transition-all hover:shadow-[0_0_25px_#ea580c] text-center text-sm uppercase tracking-widest block w-full sm:w-auto"
            >
              Cotizar Proyecto
            </Link>
            
            <Link 
              href="/servicios" 
              className="bg-transparent border border-neutral-600 hover:border-neutral-400 text-white px-8 py-4 font-bold rounded-sm transition-colors text-center text-sm uppercase tracking-widest block w-full sm:w-auto glass"
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
