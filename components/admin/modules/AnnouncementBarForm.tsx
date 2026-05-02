'use client'

import { useState } from 'react'
import { AnnouncementBarConfig, saveAnnouncementBar } from '@/lib/actions/announcement'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Save } from 'lucide-react'

interface Props {
  tenantId: string
  initialData: AnnouncementBarConfig
  isDeveloperView?: boolean
}

export function AnnouncementBarForm({ tenantId, initialData, isDeveloperView }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, watch } = useForm({
    defaultValues: initialData
  })

  // Watch values for live preview
  const watchedValues = watch()

  const onSubmit = async (data: any) => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      // Inyectamos el tenantId si es la vista de desarrollador
      if (isDeveloperView) {
        formData.append('_tenantId', tenantId)
      }
      
      // Mapeamos el resto de campos
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value))
      })

      const res = await saveAnnouncementBar(formData)
      if (res.error) setError(res.error)
      if (res.success) setMessage(res.success)
    } catch (e) {
      setError('Error al conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-neutral-500"
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1"

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Live preview */}
      {watchedValues.isActive && watchedValues.text && (
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Vista Previa en Tiempo Real</p>
          <div
            className="rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-between gap-4 shadow-xl border border-white/5"
            style={{ backgroundColor: watchedValues.bgColor, color: watchedValues.textColor }}
          >
            <span>{watchedValues.text}</span>
            {watchedValues.ctaText && <span className="underline font-bold shrink-0">{watchedValues.ctaText} →</span>}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6 shadow-2xl">
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Estado de la barra</label>
            <select {...register('isActive')} className={inputClass}>
              <option value="false">🔴 Desactivada (Oculta)</option>
              <option value="true">🟢 Activa (Visible)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Ubicación</label>
            <select {...register('pages')} className={inputClass}>
              <option value="all">Todo el sitio</option>
              <option value="home">Solo Inicio (Home)</option>
              <option value="servicios">Solo Servicios</option>
              <option value="contacto">Solo Contacto</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Mensaje del Anuncio *</label>
          <textarea 
            {...register('text')} 
            required 
            rows={2}
            className={`${inputClass} resize-none`} 
            placeholder="🔧 Nueva línea de mecanizado disponible. Consulta tiempos de entrega." 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Texto del Botón (CTA)</label>
            <input {...register('ctaText')} className={inputClass} placeholder="Ver más" />
          </div>
          <div>
            <label className={labelClass}>Enlace del Botón (URL)</label>
            <input {...register('ctaUrl')} className={inputClass} placeholder="/servicios" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Color de Fondo</label>
            <div className="flex items-center gap-3 bg-neutral-950 p-2 rounded border border-neutral-800">
              <input type="color" {...register('bgColor')} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
              <span className="font-mono text-xs text-neutral-400 uppercase">{watchedValues.bgColor}</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Color de Texto</label>
            <div className="flex items-center gap-3 bg-neutral-950 p-2 rounded border border-neutral-800">
              <input type="color" {...register('textColor')} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
              <span className="font-mono text-xs text-neutral-400 uppercase">{watchedValues.textColor}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>¿Permitir cerrar?</label>
            <select {...register('dismissible')} className={inputClass}>
              <option value="true">Sí, el usuario puede ocultarla</option>
              <option value="false">No, fija para todos</option>
            </select>
          </div>
          <div className="bg-orange-500/5 border border-orange-500/10 p-3 rounded text-[10px] text-orange-500/70 uppercase font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            La barra aparecerá automáticamente si las fechas están vigentes o vacías.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
          <div>
            <label className={labelClass}>Fecha de Lanzamiento (Opcional)</label>
            <input type="datetime-local" {...register('startsAt' as any)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha de Expiración (Opcional)</label>
            <input type="datetime-local" {...register('endsAt' as any)} className={inputClass} />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="bg-orange-600 hover:bg-orange-500 active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-white font-black py-4 px-8 rounded-xl transition-all uppercase tracking-widest w-full flex items-center justify-center gap-3 shadow-lg shadow-orange-950/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </form>
    </div>
  )
}
