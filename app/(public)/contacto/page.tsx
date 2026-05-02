import { ContactForm } from '@/components/features/ContactForm';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getSiteConfig } from '@/lib/site/get-site-config';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteConfig();
  return {
    title: `Contacto | ${config?.name || 'Servicios Jess'}`,
    description: config?.metaDescription || 'Solicita cotizaciones e ingeniería especializada.',
  };
}

export default async function ContactPage() {
  const { config, activeFlags } = await getSiteConfig();

  return (
    <div className="bg-neutral-950 py-16 text-neutral-100 flex-1">

      {/* Header Intermedio */}
      <div className="bg-neutral-900 border-b border-neutral-800 py-24 mb-16 relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900/80 to-neutral-800/20" />
        <div className="max-w-[1320px] mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg text-white uppercase">
            Contacto <span className="text-[var(--color-primary)]">Técnico</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light">
            Nuestro equipo de ingeniería está disponible para cotizaciones, mecanizado especializado y asesorías B2B.
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Tarjeta Informativa Lateral */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-neutral-900/50 p-8 rounded-sm shrink-0 border border-neutral-800/50 glass">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-sm">Información Comercial</h3>

              <ul className="space-y-6 text-neutral-300">
                {config?.contactAddress && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-[var(--background)] border border-neutral-800 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Planta Operativa</h4>
                      <p className="text-sm font-medium text-neutral-400">{config.contactAddress}</p>
                    </div>
                  </li>
                )}

                {config?.contactPhone && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-[var(--background)] border border-neutral-800 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Teléfono Corporativo</h4>
                      <p className="text-sm font-medium text-neutral-400">{config.contactPhone}</p>
                    </div>
                  </li>
                )}

                {config?.contactEmail && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-[var(--background)] border border-neutral-800 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Correo Electrónico</h4>
                      <p className="text-sm font-medium text-neutral-400">{config.contactEmail}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Mapa Fallback Minimalista o Iframe Dinámico */}
            <div className="rounded-sm overflow-hidden h-80 border border-neutral-800/50 relative bg-[var(--background)] flex flex-col items-center justify-center text-center glass">
              {config?.mapEmbedUrl ? (
                <iframe 
                  src={config.mapEmbedUrl} 
                  className="absolute inset-0 w-full h-full grayscale opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="opacity-80 relative flex flex-col items-center justify-center p-6 h-full w-full">
                  <div className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[var(--color-primary)]">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-200 mb-1 uppercase tracking-widest text-sm">Ubicación de Planta</h4>
                  <p className="text-sm text-neutral-500 font-medium">Contáctanos para agendar una visita a nuestras instalaciones y revisar detalles operacionales en terreno.</p>
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Formulario Contacto */}
          <div className="lg:col-span-8 bg-neutral-900/40 border border-neutral-800/50 rounded-sm overflow-hidden glass">
            <div className="p-8 lg:p-12 h-full">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Envíanos un mensaje</h3>
              <p className="text-neutral-400 mb-8 font-light text-lg">Completa los datos y te orientaremos en la manufactura que tu empresa necesita.</p>
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
