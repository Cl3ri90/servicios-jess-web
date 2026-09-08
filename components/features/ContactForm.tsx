'use client';

import { useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { createContactLead } from '@/lib/actions/contact-leads';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/track-event';

export function ContactForm() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setState(null);
    startTransition(async () => {
      const result = await createContactLead(formData);
      setState(result);
      if (result.success) {
        // Track event
        trackEvent({
          type: 'contact_form_submit',
          label: 'Formulario de contacto',
          metadata: { 
            source: formData.get('source') as string,
            success: true 
          }
        });

        // Podríamos limpiar el formulario aquí si queremos
        const form = document.getElementById('public-contact-form') as HTMLFormElement;
        if (form) form.reset();
      }
    });
  }

  if (state?.success) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-900 rounded p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/50 text-emerald-500 mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-emerald-400">¡Solicitud Enviada!</h4>
        <p className="text-neutral-300">{state.message}</p>
        <button onClick={() => setState(null)} className="mt-4 px-6 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form id="public-contact-form" action={handleSubmit} className="space-y-6">
      {/* Honeypot field - Bot trap */}
      <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="url" name="website" id="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Hidden contextual fields */}
      <input type="hidden" name="pageUrl" value={pathname || '/'} />
      <input type="hidden" name="source" value="contact_form" />

      {state?.error && (
        <div className="bg-red-950/50 border border-red-900/50 text-red-400 p-4 rounded flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--site-text)] uppercase tracking-widest block mb-1">Nombre Completo <span className="text-[var(--site-primary)]">*</span></label>
          <input required name="name" type="text" disabled={isPending} className="w-full bg-[var(--site-surface-secondary)] border border-[var(--site-border)] p-4 font-medium text-[var(--site-text)] rounded-xl focus:border-[var(--site-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--site-primary)] transition-all disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--site-text)] uppercase tracking-widest block mb-1">Empresa</label>
          <input name="company" type="text" disabled={isPending} className="w-full bg-[var(--site-surface-secondary)] border border-[var(--site-border)] p-4 font-medium text-[var(--site-text)] rounded-xl focus:border-[var(--site-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--site-primary)] transition-all disabled:opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--site-text)] uppercase tracking-widest block mb-1">Correo Corporativo <span className="text-[var(--site-primary)]">*</span></label>
          <input required name="email" type="email" disabled={isPending} className="w-full bg-[var(--site-surface-secondary)] border border-[var(--site-border)] p-4 font-medium text-[var(--site-text)] rounded-xl focus:border-[var(--site-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--site-primary)] transition-all disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--site-text)] uppercase tracking-widest block mb-1">Teléfono Directo</label>
          <input name="phone" type="text" disabled={isPending} className="w-full bg-[var(--site-surface-secondary)] border border-[var(--site-border)] p-4 font-medium text-[var(--site-text)] rounded-xl focus:border-[var(--site-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--site-primary)] transition-all disabled:opacity-50" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--site-text)] uppercase tracking-widest block mb-1">Detalle Técnico o Requerimiento <span className="text-[var(--site-primary)]">*</span></label>
        <textarea required name="message" rows={5} disabled={isPending} className="w-full bg-[var(--site-surface-secondary)] border border-[var(--site-border)] p-4 font-medium text-[var(--site-text)] rounded-xl focus:border-[var(--site-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--site-primary)] transition-all resize-none disabled:opacity-50"></textarea>
      </div>

      <div className="pt-6">
        <button type="submit" disabled={isPending} className="w-full py-5 bg-[var(--site-primary)] text-white font-black text-sm tracking-widest uppercase hover:opacity-90 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          {isPending ? 'PROCESANDO SOLICITUD...' : 'ENVIAR SOLICITUD TÉCNICA'}
        </button>
      </div>
    </form>
  );
}
