'use client';

import { useActionState, useEffect } from 'react';
import { saveSeoConfig } from '@/lib/actions/seo';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold py-3 px-8 rounded-lg transition-all uppercase tracking-wider ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {pending ? 'GUARDANDO...' : 'Guardar SEO'}
    </button>
  );
}

export function SeoForm({ seo, pageKeys }: { seo: any, pageKeys: string[] }) {
  const initialState: any = { success: false, message: '', error: '' };
  const [state, formAction] = useActionState(saveSeoConfig as any, initialState);

  useEffect(() => {
    if (state.message) toast.success(state.message);
    if (state.error) toast.error(state.error);
  }, [state]);

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-neutral-500";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1";

  return (
    <form action={formAction} className="space-y-10">
      {/* Global SEO */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-orange-500 uppercase tracking-wider">SEO Global del Sitio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Título base del sitio</label>
            <input name="global_siteTitle" className={inputClass} defaultValue={seo.global.siteTitle || ''} placeholder="Mi Empresa SpA" />
          </div>
          <div>
            <label className={labelClass}>Palabras clave (keywords)</label>
            <input name="global_keywords" className={inputClass} defaultValue={seo.global.keywords || ''} placeholder="metalmecánica, chile, industria" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Descripción global</label>
            <textarea name="global_description" className={inputClass} rows={2} defaultValue={seo.global.description || ''} placeholder="Descripción que aparecerá en Google cuando no exista una específica por página." />
          </div>
          <div>
            <label className={labelClass}>URL canónica base</label>
            <input name="global_canonicalBase" className={inputClass} defaultValue={seo.global.canonicalBase || ''} placeholder="https://miempresa.cl" />
          </div>
          <div>
            <label className={labelClass}>Imagen Open Graph global (URL)</label>
            <input name="global_ogImage" className={inputClass} defaultValue={seo.global.ogImage || ''} placeholder="https://..." />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <select name="global_noindex" className={`${inputClass} w-auto`} defaultValue={seo.global.noindex ? 'true' : 'false'}>
            <option value="false">✅ Indexar el sitio (recomendado)</option>
            <option value="true">🚫 No indexar (noindex)</option>
          </select>
        </div>
      </section>

      {/* Schema / Datos Estructurados */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-orange-500 uppercase tracking-wider">Datos Estructurados (Schema.org)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={labelClass}>Nombre de la Organización</label><input name="schema_orgName" className={inputClass} defaultValue={seo.schema.orgName || ''} /></div>
          <div><label className={labelClass}>URL del sitio</label><input name="schema_orgUrl" className={inputClass} defaultValue={seo.schema.orgUrl || ''} placeholder="https://miempresa.cl" /></div>
          <div><label className={labelClass}>URL del Logo</label><input name="schema_orgLogo" className={inputClass} defaultValue={seo.schema.orgLogo || ''} /></div>
          <div><label className={labelClass}>Dirección física</label><input name="schema_address" className={inputClass} defaultValue={seo.schema.address || ''} /></div>
          <div><label className={labelClass}>Teléfono</label><input name="schema_phone" className={inputClass} defaultValue={seo.schema.phone || ''} /></div>
          <div><label className={labelClass}>Email de contacto</label><input name="schema_email" className={inputClass} defaultValue={seo.schema.email || ''} /></div>
        </div>
      </section>

      {/* SEO por página */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-orange-500 uppercase tracking-wider">SEO por Página</h3>
        {pageKeys.map(page => (
          <div key={page} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <h4 className="text-white font-bold capitalize">/{page === 'inicio' ? '' : page}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Title</label><input name={`page_${page}_title`} className={inputClass} defaultValue={(seo.pages as any)[page]?.title || ''} placeholder={`Capacidades | Mi Empresa`} /></div>
              <div><label className={labelClass}>Description</label><input name={`page_${page}_description`} className={inputClass} defaultValue={(seo.pages as any)[page]?.description || ''} /></div>
              <div><label className={labelClass}>OG Title</label><input name={`page_${page}_ogTitle`} className={inputClass} defaultValue={(seo.pages as any)[page]?.ogTitle || ''} /></div>
              <div><label className={labelClass}>OG Description</label><input name={`page_${page}_ogDescription`} className={inputClass} defaultValue={(seo.pages as any)[page]?.ogDescription || ''} /></div>
              <div><label className={labelClass}>OG Image URL</label><input name={`page_${page}_ogImage`} className={inputClass} defaultValue={(seo.pages as any)[page]?.ogImage || ''} /></div>
              <div><label className={labelClass}>Canonical (opcional)</label><input name={`page_${page}_canonical`} className={inputClass} defaultValue={(seo.pages as any)[page]?.canonical || ''} /></div>
            </div>
          </div>
        ))}
      </section>

      <SubmitButton />
    </form>
  )
}
