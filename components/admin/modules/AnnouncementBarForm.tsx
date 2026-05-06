'use client'

import { useState, useEffect } from 'react'
import { AnnouncementBarConfig, saveAnnouncementBar } from '@/lib/actions/announcement'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { LivePreviewShell } from '@/components/admin/live-preview-shell'
import { DirtySaveBtn } from '@/components/admin/dirty-save-btn'
import { AnnouncementBarClient } from '@/components/site/announcement-bar-client'

interface Props {
  tenantId: string
  initialData: AnnouncementBarConfig
  isDeveloperView?: boolean
}

export function AnnouncementBarForm({ tenantId, initialData, isDeveloperView }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { isDirty: formIsDirty } } = useForm({
    defaultValues: initialData
  })

  // Watch values for live preview
  const watchedValues = watch()

  useEffect(() => {
    setIsDirty(formIsDirty);
  }, [formIsDirty]);

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
      if (res.success) {
        setMessage(typeof res.success === 'string' ? res.success : 'Actualización exitosa.')
        reset(data) // Reset form to new values, making isDirty false
        setIsDirty(false)
      }
    } catch (e) {
      setError('Error al conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-neutral-500"
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form id="announcement-form" onSubmit={handleSubmit(onSubmit)} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6 shadow-2xl relative order-2 lg:order-1">
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

        <div className="pt-4 border-t border-neutral-800">
          <DirtySaveBtn 
            isDirty={isDirty} 
            isSaving={loading} 
            form="announcement-form" 
            label="Guardar Configuración" 
            className="w-full"
          />
        </div>
      </form>

      {/* Sidebar Live Preview */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
        <LivePreviewShell title="Sandbox: Anuncio de Emergencia" className="mb-0">
          <div className="p-6 bg-zinc-950 flex flex-col justify-center min-h-[250px]">
            {String(watchedValues.isActive) === 'true' && watchedValues.text ? (
              <AnnouncementBarClient 
                text={watchedValues.text}
                ctaText={watchedValues.ctaText}
                ctaUrl={watchedValues.ctaUrl}
                bgColor={watchedValues.bgColor}
                textColor={watchedValues.textColor}
                dismissible={String(watchedValues.dismissible) === 'true'}
                isPreview={true}
              />
            ) : (
              <div className="text-center p-8 border border-neutral-800 border-dashed rounded-lg">
                <p className="text-neutral-500 text-sm">El anuncio está oculto o sin texto.</p>
              </div>
            )}
          </div>
        </LivePreviewShell>
      </div>
    </div>
  )
}
