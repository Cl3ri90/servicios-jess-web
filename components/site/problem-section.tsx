import { FadeIn } from '@/components/ui/fade-in-wrapper';

export function ProblemSection() {
  return (
    <section className="w-full bg-white py-32 border-b border-zinc-100 relative overflow-hidden">
      {/* Decorative clean grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
            <span className="text-orange-600 font-bold text-sm tracking-widest uppercase mb-4">El Costo Operativo</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-950 mb-6 leading-tight">
              Un milímetro de tolerancia puede detener plantas enteras.
            </h2>
            <p className="text-xl text-zinc-500 font-light leading-relaxed">
              La manufactura corporativa no tiene margen para retrasos. Proveedores ineficientes cuestan millones en maquinarias detenidas y plazos de entrega rotos.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Retrasos Críticos",
              desc: "Cuando importaciones o proveedores fallan, las líneas se detienen."
            },
            {
              title: "Tolerancia Cero",
              desc: "Piezas genéricas destruyen maquinarias que valen de miles de dólares."
            },
            {
              title: "Cadenas Rotas",
              desc: "La falta de stock mecanizado de piezas maestras congela operaciones."
            }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1} className="h-full">
              <div className="bg-zinc-50 rounded-3xl p-10 h-full border border-zinc-100 flex flex-col justify-center transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 shadow-md text-white font-bold">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-950 mb-3">{item.title}</h3>
                <p className="text-zinc-500 font-normal leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
