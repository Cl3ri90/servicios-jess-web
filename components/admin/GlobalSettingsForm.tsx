'use client'

import { useState, useTransition } from 'react'
import { SiteSettings, updateGlobalSettings } from '@/lib/actions/config'

export function GlobalSettingsForm({ initialData }: { initialData: SiteSettings }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        const res = await updateGlobalSettings(formData)
        if (res.error) setMessage({ type: 'error', text: res.error })
        if (res.success) setMessage({ type: 'success', text: res.success })
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fatal de sistema.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 background-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-xl relative">
      <h3 className="text-xl font-bold uppercase tracking-widest text-orange-500 mb-6 border-b border-neutral-800 pb-2">1. BRANDING VISUAL</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Escudo / Logo Principal</label>
           {initialData.logoUrl && <img src={initialData.logoUrl} alt="Logo" className="h-12 object-contain mb-3 border border-neutral-800 p-1 bg-black/50" />}
           <input type="file" name="logoFile" accept="image/*" className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition" />
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Favicon Corporativo</label>
           {initialData.faviconUrl && <img src={initialData.faviconUrl} alt="Favicon" className="h-10 w-10 object-contain mb-3 border border-neutral-800 p-1 bg-black/50" />}
           <input type="file" name="faviconFile" accept="image/*" className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition" />
        </div>
      </div>

      <h3 className="text-xl font-bold uppercase tracking-widest text-orange-500 mb-6 border-b border-neutral-800 pb-2 mt-12">2. COLORES MAESTROS (HEX)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Acento Principal</label>
            <div className="flex gap-2 items-center">
              <input type="color" name="primaryColor" defaultValue={initialData.primaryColor} className="h-10 w-10 bg-transparent rounded cursor-pointer" />
              <input type="text" name="primaryColorStr" defaultValue={initialData.primaryColor} className="flex-1 bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-300 pointer-events-none" readOnly />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Usado en hover, botones CTA y badges.</p>
         </div>
         <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Fondo Base</label>
            <div className="flex gap-2 items-center">
              <input type="color" name="bgColor" defaultValue={initialData.bgColor} className="h-10 w-10 bg-transparent rounded cursor-pointer" />
              <input type="text" name="bgColorStr" defaultValue={initialData.bgColor} className="flex-1 bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-300 pointer-events-none" readOnly />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Color raíz de la aplicación web.</p>
         </div>
         <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Textos Base</label>
            <div className="flex gap-2 items-center">
              <input type="color" name="textColor" defaultValue={initialData.textColor} className="h-10 w-10 bg-transparent rounded cursor-pointer" />
              <input type="text" name="textColorStr" defaultValue={initialData.textColor} className="flex-1 bg-neutral-950 border border-neutral-800 px-3 py-2 text-neutral-300 pointer-events-none" readOnly />
            </div>
         </div>
      </div>

      <h3 className="text-xl font-bold uppercase tracking-widest text-orange-500 mb-6 border-b border-neutral-800 pb-2 mt-12">3. ESTRUCTURA Y CONTACTO</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Nombre / Texto Header</label>
           <input type="text" name="headerText" defaultValue={initialData.headerText} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none" placeholder="SERVICIOS JESS"/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Párrafo Footer</label>
           <textarea name="footerText" defaultValue={initialData.footerText} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none" rows={3}></textarea>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Email de Contacto Global</label>
           <input type="email" name="contactEmail" defaultValue={initialData.contactEmail} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Teléfono Comercial</label>
           <input type="text" name="contactPhone" defaultValue={initialData.contactPhone} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-neutral-400 mb-2">Número WhatsApp (Integración chat rápido)</label>
           <input type="text" name="whatsappPhone" defaultValue={initialData.whatsappPhone} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none" placeholder="+56912345678"/>
        </div>
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-neutral-400 mb-2">Dirección Matriz</label>
           <input type="text" name="address" defaultValue={initialData.address} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
      </div>

      <h3 className="text-xl font-bold uppercase tracking-widest text-orange-500 mb-6 border-b border-neutral-800 pb-2 mt-12">4. TEXTOS LEGALES (COMPLIANCE B2B)</h3>
      <div className="grid grid-cols-1 gap-6">
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Términos y Condiciones Contractuales</label>
           <textarea name="legalTerms" defaultValue={initialData.legalTerms} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none font-mono text-xs" rows={4}></textarea>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Política de Privacidad y NDA Gubernamental</label>
           <textarea name="legalPrivacy" defaultValue={initialData.legalPrivacy} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none font-mono text-xs" rows={4}></textarea>
        </div>
      </div>

      <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c] mb-6 border-b border-neutral-800 pb-2 mt-12">5. TOGGLES Y MÓDULOS DE INICIO (HOME)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <label className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded cursor-pointer hover:border-orange-500 transition-colors">
          <span className="text-sm text-neutral-300 font-bold">Mostrar Hero Principal</span>
          <input type="checkbox" name="showHero" defaultChecked={initialData.showHero} className="w-5 h-5 accent-orange-500 rounded bg-neutral-800 border-neutral-700" />
        </label>
        <label className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded cursor-pointer hover:border-orange-500 transition-colors">
          <span className="text-sm text-neutral-300 font-bold">Mostrar Grid Servicios</span>
          <input type="checkbox" name="showServices" defaultChecked={initialData.showServices} className="w-5 h-5 accent-orange-500 rounded bg-neutral-800 border-neutral-700" />
        </label>
        <label className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded cursor-pointer hover:border-orange-500 transition-colors">
          <span className="text-sm text-neutral-300 font-bold">Mostrar Carrusel Trust Logos</span>
          <input type="checkbox" name="showClients" defaultChecked={initialData.showClients} className="w-5 h-5 accent-orange-500 rounded bg-neutral-800 border-neutral-700" />
        </label>
        <label className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded cursor-pointer hover:border-orange-500 transition-colors">
          <span className="text-sm text-neutral-300 font-bold">Mostrar Banda de KPIs</span>
          <input type="checkbox" name="showMetrics" defaultChecked={initialData.showMetrics} className="w-5 h-5 accent-orange-500 rounded bg-neutral-800 border-neutral-700" />
        </label>
        <label className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded cursor-pointer hover:border-orange-500 transition-colors">
          <span className="text-sm text-neutral-300 font-bold">Mostrar Bloque "Cotizar"</span>
          <input type="checkbox" name="showIndustrialCTA" defaultChecked={initialData.showIndustrialCTA} className="w-5 h-5 accent-orange-500 rounded bg-neutral-800 border-neutral-700" />
        </label>
      </div>

      <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c] mb-6 border-b border-neutral-800 pb-2 mt-12">6. CONFIGURACIÓN DEL HERO (HOME)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/50 p-6 rounded-lg border border-neutral-800/50">
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Título Principal (Hero)</label>
           <input type="text" name="heroTitle" defaultValue={initialData.heroTitle} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Subtítulo (Hero)</label>
           <input type="text" name="heroSubtitle" defaultValue={initialData.heroSubtitle} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Texto Botón Principal</label>
           <input type="text" name="heroBtnText" defaultValue={initialData.heroBtnText} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Texto Botón Secundario</label>
           <input type="text" name="heroSecBtnText" defaultValue={initialData.heroSecBtnText} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-neutral-400 mb-2">Fondo del Hero (Upload al Vercel Blob)</label>
           {initialData.heroBgUrl && <img src={initialData.heroBgUrl} alt="Hero bg" className="h-16 w-32 object-cover mb-3 border border-neutral-800 rounded" />}
           <input type="file" name="heroBgFile" accept="image/*" className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition" />
        </div>
      </div>

      <h3 className="text-xl font-bold uppercase tracking-widest text-[#ea580c] mb-6 border-b border-neutral-800 pb-2 mt-12">7. MAPA INCORPORADO Y FOOTER FIRMA</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/50 p-6 rounded-lg border border-neutral-800/50">
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-neutral-400 mb-2">URL del SRC del Iframe de Google Maps</label>
           <input type="text" name="mapEmbedUrl" defaultValue={initialData.mapEmbedUrl} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none" placeholder="https://www.google.com/maps/embed?..."/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">Firma Desarrollador (Developer Signature)</label>
           <input type="text" name="devSignature" defaultValue={initialData.devSignature} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-400 mb-2">URL Enlace de Desarrollador</label>
           <input type="url" name="devSignatureUrl" defaultValue={initialData.devSignatureUrl} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
        </div>
      </div>

      <h3 className="text-xl font-bold uppercase tracking-widest text-orange-500 mb-6 border-b border-neutral-800 pb-2 mt-12 flex items-center justify-between">
        8. ESTADO CRÍTICO DEL SISTEMA
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" name="maintenance" defaultChecked={initialData.maintenance} className="sr-only peer" />
          <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          <span className="ml-3 text-sm font-bold text-neutral-300">Activar Mantenimiento (Lock)</span>
        </label>
      </h3>
      <div>
         <label className="block text-sm font-medium text-neutral-400 mb-2">Mensaje en Pantalla Bloqueada (503)</label>
         <input type="text" name="maintenanceText" defaultValue={initialData.maintenanceText} className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2 text-white focus:border-orange-500 outline-none"/>
      </div>

      {message && (
        <div className={`p-4 rounded border font-bold text-center mt-8 ${message.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-500'}`}>
          {message.text}
        </div>
      )}

      <button disabled={isPending} type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 transition-colors uppercase font-black tracking-widest text-white shadow-xl mt-8 sticky bottom-4">
        {isPending ? 'Propagando Cambios a CDN...' : 'SALVAR Y RECONSTRUIR UI GLOBA'}
      </button>
    </form>
  )
}
