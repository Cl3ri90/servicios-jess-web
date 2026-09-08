import { ContactForm } from '@/components/features/ContactForm';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getSiteConfig } from '@/lib/site/get-site-config';
import type { Metadata } from 'next';

export const dynamic = "force-dynamic";

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
    <div className="bg-[var(--site-background)] py-16 text-[var(--site-text)] flex-1">

      {/* Header Intermedio */}
      <div className="bg-[var(--site-surface-secondary)] border-b border-[var(--site-border)] py-24 mb-16 relative overflow-hidden mt-20">
        <div className="max-w-[1320px] mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-[var(--site-text)] uppercase">
            Contacto <span className="text-[var(--site-primary)]">Técnico</span>
          </h1>
          <p className="text-xl text-[var(--site-text-muted)] max-w-2xl mx-auto font-normal">
            Nuestro equipo de ingeniería está disponible para cotizaciones, mecanizado especializado y asesorías B2B.
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Tarjeta Informativa Lateral */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[var(--site-surface)] p-8 rounded-2xl shrink-0 border border-[var(--site-border)] shadow-sm">
              <h3 className="text-xl font-bold text-[var(--site-text)] mb-6 uppercase tracking-widest text-sm">Información Comercial</h3>

              <ul className="space-y-6 text-[var(--site-text-muted)]">
                {config?.contactAddress && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--site-surface-secondary)] border border-[var(--site-border)] flex items-center justify-center text-[var(--site-primary)] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--site-text)] text-sm uppercase tracking-wider mb-1">Planta Operativa</h4>
                      <p className="text-sm font-normal text-[var(--site-text-muted)]">{config.contactAddress}</p>
                    </div>
                  </li>
                )}

                {config?.contactPhone && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--site-surface-secondary)] border border-[var(--site-border)] flex items-center justify-center text-[var(--site-primary)] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--site-text)] text-sm uppercase tracking-wider mb-1">Teléfono Corporativo</h4>
                      <p className="text-sm font-normal text-[var(--site-text-muted)]">{config.contactPhone}</p>
                    </div>
                  </li>
                )}

                {config?.contactEmail && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--site-surface-secondary)] border border-[var(--site-border)] flex items-center justify-center text-[var(--site-primary)] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--site-text)] text-sm uppercase tracking-wider mb-1">Correo Electrónico</h4>
                      <p className="text-sm font-normal text-[var(--site-text-muted)]">{config.contactEmail}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Mapa Fallback Minimalista o Iframe Dinámico */}
            <div className="group rounded-2xl overflow-hidden h-80 border border-[var(--site-border)] relative bg-[var(--site-surface-secondary)] flex flex-col items-center justify-center text-center shadow-sm">
              {config?.mapEmbedUrl ? (
                <iframe 
                  src={config.mapEmbedUrl} 
                  className="absolute inset-0 w-full h-full grayscale opacity-80 mix-blend-luminosity group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 group-focus-within:grayscale-0 group-focus-within:mix-blend-normal group-focus-within:opacity-100 active:grayscale-0 active:mix-blend-normal active:opacity-100 transition-all duration-500 ease-out pointer-events-auto"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="opacity-80 relative flex flex-col items-center justify-center p-6 h-full w-full">
                  <div className="w-16 h-16 rounded-lg bg-[var(--site-surface)] border border-[var(--site-border)] flex items-center justify-center mb-4 text-[var(--site-primary)] shadow-sm">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--site-text)] mb-1 uppercase tracking-widest text-sm">Ubicación de Planta</h4>
                  <p className="text-sm text-[var(--site-text-muted)] font-normal">Contáctanos para agendar una visita a nuestras instalaciones y revisar detalles operacionales en terreno.</p>
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Formulario Contacto */}
          <div className="lg:col-span-8 bg-[var(--site-surface)] border border-[var(--site-border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-8 lg:p-12 h-full">
              <h3 className="text-xl font-bold text-[var(--site-text)] mb-2 uppercase tracking-widest">Envíanos un mensaje</h3>
              <p className="text-[var(--site-text-muted)] mb-8 font-normal text-lg">Completa los datos y te orientaremos en la manufactura que tu empresa necesita.</p>
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
