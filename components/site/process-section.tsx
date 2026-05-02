import { FadeIn } from '@/components/ui/fade-in-wrapper';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      title: "Análisis de Tolerancias",
      desc: "Nuestros ingenieros evalúan tus planos para optimizar el material y el diseño según estrés operativo."
    },
    {
      title: "Calibración CNC & Setup",
      desc: "Programación de maquinaria y setup de entorno para asegurar consistencia desde la primera hasta la última pieza."
    },
    {
      title: "Mecanizado de Precisión",
      desc: "Fabricación rigurosa operada por técnicos especialistas. Monitoreo constante de calidad."
    },
    {
      title: "Entrega Controlada",
      desc: "Auditoría final y despliegue logístico para que el componente llegue intacto a tu planta matriz."
    }
  ];

  return (
    <section className="w-full bg-zinc-950 py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-zinc-900/40 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <FadeIn className="text-center mb-24">
          <span className="text-white bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-6 inline-block">ROADMAP OPERACIONAL</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Fabricación sin fricción.
          </h2>
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            Un proceso estandarizado para proteger tu tranquilidad y garantizar la continuidad de la industria.
          </p>
        </FadeIn>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="hidden md:block absolute left-8 top-10 bottom-10 w-[2px] bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent" />

          <div className="space-y-12">
            {steps.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.15}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 relative group">
                  <div className="hidden md:flex flex-shrink-0 w-16 h-16 bg-zinc-900 border-2 border-zinc-800 rounded-2xl items-center justify-center font-bold text-white shadow-lg transition-transform group-hover:scale-110 relative z-10">
                    0{idx + 1}
                  </div>
                  <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-3xl flex-1 transition-all group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="md:hidden w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <h3 className="text-2xl font-extrabold tracking-tight text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-zinc-400 text-base leading-relaxed md:pl-0 pl-12">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
