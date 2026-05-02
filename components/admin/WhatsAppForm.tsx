'use client'

import { useState } from 'react'
import { upsertWhatsAppConfig } from '@/lib/actions/whatsapp'

export function WhatsAppForm({ initialData, tenantId }: { initialData: any, tenantId?: string }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    if (tenantId) formData.append('developerTenantId', tenantId)
    try {
      const res = await upsertWhatsAppConfig(formData)
      if (res?.error) {
        alert(res.error)
      } else {
        alert(res?.success || 'Guardado.')
      }
    } catch (e) {
      alert('Error guardando')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-xl">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[#25D366] mb-2">
          Número de Teléfono Pyme
        </label>
        <p className="text-xs text-neutral-500 mb-2 font-mono">Ej: +56912345678</p>
        <input 
          name="phoneNumber"
          type="text"
          defaultValue={initialData?.phoneNumber || ''}
          placeholder="+569"
          required
          className="w-full p-4 bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-[#25D366] font-mono text-xl transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
          Mensaje de Saludo por Defecto
        </label>
        <p className="text-xs text-neutral-500 mb-2 font-mono">Texto que aparecerá precargado cuando el usuario abra tu WhatsApp.</p>
        <textarea 
          name="defaultMessage"
          rows={3}
          defaultValue={initialData?.defaultMessage || 'Hola, quisiera cotizar un servicio industrial.'}
          className="w-full p-4 bg-neutral-950 border border-neutral-700 rounded text-neutral-300 focus:outline-none focus:border-[#25D366] transition-colors"
        />
      </div>

      <div className="pt-4 border-t border-neutral-800 flex justify-end">
         <button 
           type="submit" 
           disabled={loading}
           className="bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white font-bold py-3 px-8 rounded shadow-lg transition-colors uppercase tracking-widest text-sm"
         >
           {loading ? 'Guardando...' : 'Aplicar Configuración WhatsApp'}
         </button>
      </div>
    </form>
  )
}
