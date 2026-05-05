'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from './animated-counter';

export function CompanyMetricsCard() {
  const metrics = [
    { 
      label: "Años de experiencia acumulada", 
      value: <AnimatedCounter to={20} prefix="+" /> 
    },
    { 
      label: "Inicio de operaciones", 
      value: <AnimatedCounter from={2000} to={2014} /> 
    },
    { 
      label: "Soluciones a medida", 
      value: <AnimatedCounter to={100} suffix="%" /> 
    },
    { 
      label: "Enfoque industrial y corporativo", 
      value: "B2B" 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="relative w-full rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden border-t-2 border-t-[#ea580c] p-8 sm:p-10"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.18),transparent_35%)] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #52525B 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="relative z-10">
        <h4 className="text-[#ea580c] uppercase tracking-[0.24em] text-xs font-bold mb-4">
          RESPALDO TÉCNICO
        </h4>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-4">
          Capacidad industrial comprobada
        </h3>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
          Integramos experiencia, precisión y respuesta técnica para entregar soluciones confiables a distintos sectores productivos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="p-5 rounded-xl border border-white/10 bg-black/40 flex flex-col justify-center"
            >
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tighter">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-2 leading-tight">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
