'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SiteSettings } from '@/lib/actions/config'
import { updateGlobalSettings } from '@/lib/actions/config'
import { 
  Palette, 
  Type, 
  Contact, 
  Settings2, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  MonitorOff,
  ChevronLeft
} from 'lucide-react'

// Tab definitions (Base)
const TABS = [
  { id: 'identidad', label: 'Identidad Visual', icon: <Palette className="w-4 h-4" /> },
  { id: 'contenido', label: 'Contenido Principal', icon: <Type className="w-4 h-4" /> },
  { id: 'contacto', label: 'Contacto & Legales', icon: <Contact className="w-4 h-4" /> },
  { id: 'avanzado', label: 'Avanzado & Sistema', icon: <Settings2 className="w-4 h-4" /> },
]

// Mapping fields to tabs for validation indicators
const TAB_FIELDS: Record<string, string[]> = {
  identidad: ['logoFile', 'faviconFile', 'primaryColor', 'bgColor', 'textColor'],
  contenido: ['heroTitle', 'heroSubtitle', 'heroBtnText', 'heroBtnLink', 'heroSecBtnText', 'heroSecBtnLink', 'heroBgFile', 'headerText', 'footerText'],
  contacto: ['contactEmail', 'contactPhone', 'whatsappPhone', 'address', 'mapEmbedUrl', 'legalTerms', 'legalPrivacy'],
  avanzado: ['showHero', 'showServices', 'showClients', 'showMetrics', 'showIndustrialCTA', 'devSignature', 'devSignatureUrl', 'maintenance', 'maintenanceText'],
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const FILE_SIZE_ERROR = "El archivo es demasiado pesado. Límite máximo: 2MB.";

function ConfigFormContent({ 
  initialSettings, 
  role, 
  flags,
  developerTenantId
}: { 
  initialSettings: SiteSettings
  role: 'DEVELOPER' | 'OWNER'
  flags: { allowEditContact: boolean, allowEditHero: boolean }
  developerTenantId?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDeveloper = role === 'DEVELOPER'

  // --- FILTRO DE PESTAÑAS POR ROL ---
  const filteredTabs = TABS.filter(tab => {
    if (tab.id === 'identidad' || tab.id === 'avanzado') return isDeveloper;
    return true;
  });

  // Ajuste de pestaña actual: si es Owner y está en una prohibida, mandar a contenido
  const rawTab = searchParams.get('tab') || (isDeveloper ? 'identidad' : 'contenido');
  const currentTab = (!isDeveloper && (rawTab === 'identidad' || rawTab === 'avanzado')) ? 'contenido' : rawTab;
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty, dirtyFields },
    reset,
    watch
  } = useForm({
    defaultValues: initialSettings,
    shouldUnregister: false
  })

  const setTab = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tabId)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const onFormSubmit = async (data: any) => {
    console.log("[DEBUG] Valores crudos de react-hook-form:", data);
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (['logoFile', 'faviconFile', 'heroBgFile'].includes(key)) return;
        if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false')
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      const filesToProcess = [
        { key: 'logoFile', data: data.logoFile },
        { key: 'faviconFile', data: data.faviconFile },
        { key: 'heroBgFile', data: data.heroBgFile }
      ]

      filesToProcess.forEach(fileObj => {
        const fileList = fileObj.data as FileList | undefined
        if (fileList && fileList.length > 0) {
          const actualFile = fileList[0]
          if (actualFile && actualFile.size > 0) {
            console.log(`[DEBUG] Añadiendo nuevo archivo para ${fileObj.key}:`, actualFile.name);
            formData.append(fileObj.key, actualFile)
          }
        }
      })

      let res = await updateGlobalSettings(formData)

      if (res.error) setError(res.error)
      if (res.success) {
        setMessage(typeof res.success === 'string' ? res.success : 'Configuración guardada exitosamente.')
        reset(data)
      }
    } catch (e: any) {
      setError('Error al procesar la actualización')
    } finally {
      setLoading(false)
    }
  }

  const getTabStatus = (tabId: string) => {
    const fields = TAB_FIELDS[tabId] || []
    const hasError = fields.some(f => errors[f as keyof typeof errors])
    const isTabDirty = fields.some(f => dirtyFields[f as keyof typeof dirtyFields])
    return { hasError, isTabDirty }
  }

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scrollTabs = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 relative">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="sticky top-0 z-40 -mx-6 px-6 py-4 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Configuración Global 
            <ChevronRight className="w-4 h-4 text-neutral-600" />
            <span className="text-[var(--color-primary)]">
              {filteredTabs.find(t => t.id === currentTab)?.label}
            </span>
          </h2>
          <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest mt-0.5">
            {role} MODE {isDirty && <span className="text-orange-500 ml-2 animate-pulse">• Cambios sin guardar</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="submit" 
            form="global-config-form"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-lg hover:bg-[var(--color-primary)]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,88,12,0.2)]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <form id="global-config-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
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

        <div className="relative group border-b border-neutral-800">
          <AnimatePresence mode="popLayout">
            {showLeftArrow && (
              <motion.button
                key="scroll-left-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => scrollTabs('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-full bg-gradient-to-r from-neutral-950 to-transparent flex items-center justify-start text-[var(--color-primary)] bg-neutral-950/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            )}
            {showRightArrow && (
              <motion.button
                key="scroll-right-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => scrollTabs('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-full bg-gradient-to-l from-neutral-950 to-transparent flex items-center justify-end text-[var(--color-primary)] bg-neutral-950/20"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>

          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-px scroll-smooth"
          >
            {filteredTabs.map((tab) => {
              const isActive = currentTab === tab.id
              const { hasError, isTabDirty } = getTabStatus(tab.id)
              
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTab(tab.id)}
                  className={`relative px-6 py-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <div className="flex gap-1 ml-1.5">
                    {hasError && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                    {isTabDirty && !hasError && <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />}
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabBranding"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full shadow-[0_-4px_10px_rgba(234,88,12,0.3)]"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          
          {/* IDENTIDAD VISUAL - PROTEGIDO */}
          {isDeveloper && (
            <section className={`p-8 space-y-8 ${currentTab !== 'identidad' ? 'hidden' : 'block'}`}>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Branding Visual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-400">Logotipo Institucional</label>
                    <div className={`bg-neutral-800/50 border-2 border-dashed p-6 rounded-xl text-center space-y-4 transition-colors ${(errors as any).logoFile ? 'border-red-500/50 bg-red-500/5' : 'border-neutral-700 hover:border-neutral-600'}`}>
                      {initialSettings.logoUrl && <img src={initialSettings.logoUrl} className="h-12 mx-auto grayscale opacity-50 contrast-125" />}
                      <input 
                        type="file" 
                        {...register('logoFile' as any, {
                          validate: (files: any) => !files?.[0] || files[0].size <= MAX_FILE_SIZE || FILE_SIZE_ERROR
                        })} 
                        accept="image/*" 
                        className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 transition-all cursor-pointer" 
                      />
                    </div>
                    {(errors as any).logoFile && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{(errors as any).logoFile.message as string}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-400">Favicon (Icono Navegador)</label>
                    <div className={`bg-neutral-800/50 border-2 border-dashed p-6 rounded-xl text-center space-y-4 transition-colors ${(errors as any).faviconFile ? 'border-red-500/50 bg-red-500/5' : 'border-neutral-700 hover:border-neutral-600'}`}>
                      {initialSettings.faviconUrl && <img src={initialSettings.faviconUrl} className="w-8 h-8 mx-auto" />}
                      <input 
                        type="file" 
                        {...register('faviconFile' as any, {
                          validate: (files: any) => !files?.[0] || files[0].size <= MAX_FILE_SIZE || FILE_SIZE_ERROR
                        })} 
                        accept="image/*" 
                        className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 transition-all cursor-pointer" 
                      />
                    </div>
                    {(errors as any).faviconFile && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{(errors as any).faviconFile.message as string}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Colores Maestros (Tokens)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-neutral-800/30 p-4 rounded-lg border border-neutral-800">
                    <label className="block text-sm text-neutral-400 mb-2 font-medium uppercase tracking-widest text-[10px]">Color Principal</label>
                    <div className="flex items-center gap-3">
                      <input type="color" {...register('primaryColor')} className="h-10 w-10 p-0 border-0 rounded bg-transparent cursor-pointer" />
                      <span className="font-mono text-white text-sm uppercase">{watch('primaryColor')}</span>
                    </div>
                  </div>
                  <div className="bg-neutral-800/30 p-4 rounded-lg border border-neutral-800">
                    <label className="block text-sm text-neutral-400 mb-2 font-medium uppercase tracking-widest text-[10px]">Color de Fondo</label>
                    <div className="flex items-center gap-3">
                      <input type="color" {...register('bgColor')} className="h-10 w-10 p-0 border-0 rounded bg-transparent cursor-pointer" />
                      <span className="font-mono text-white text-sm uppercase">{watch('bgColor')}</span>
                    </div>
                  </div>
                  <div className="bg-neutral-800/30 p-4 rounded-lg border border-neutral-800">
                    <label className="block text-sm text-neutral-400 mb-2 font-medium uppercase tracking-widest text-[10px]">Color de Texto</label>
                    <div className="flex items-center gap-3">
                      <input type="color" {...register('textColor')} className="h-10 w-10 p-0 border-0 rounded bg-transparent cursor-pointer" />
                      <span className="font-mono text-white text-sm uppercase">{watch('textColor')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CONTENIDO PRINCIPAL */}
          <section className={`p-8 space-y-8 ${currentTab !== 'contenido' ? 'hidden' : 'block'}`}>
            {(isDeveloper || flags.allowEditHero) && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Hero Section (Banner Principal)</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Título de Impacto (H1)</label>
                    <input {...register('heroTitle')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all font-bold text-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Descripción / Subtítulo</label>
                    <textarea {...register('heroSubtitle')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all h-24 lg:text-lg font-light leading-relaxed" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-neutral-800">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Botón Principal</label>
                      <input {...register('heroBtnText')} className="w-full bg-neutral-800 text-white p-2.5 rounded border border-neutral-700 text-sm" placeholder="Texto" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1 flex justify-between">Link P. <ChevronRight className="w-3 h-3 text-[var(--color-primary)]" /></label>
                      <input {...register('heroBtnLink')} className="w-full bg-neutral-800 text-white p-2.5 rounded border border-neutral-700 text-xs font-mono" placeholder="/ruta" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Botón Secundario</label>
                      <input {...register('heroSecBtnText')} className="w-full bg-neutral-800 text-white p-2.5 rounded border border-neutral-700 text-sm" placeholder="Texto" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1 flex justify-between">Link S. <ChevronRight className="w-3 h-3 text-[var(--color-primary)]" /></label>
                      <input {...register('heroSecBtnLink')} className="w-full bg-neutral-800 text-white p-2.5 rounded border border-neutral-700 text-xs font-mono" placeholder="/ruta" />
                    </div>
                  </div>
                  <div className="space-y-3 pt-6">
                    <label className="block text-sm font-medium text-neutral-400">Imagen de Fondo Hero</label>
                    <div className={`bg-neutral-800/50 border-2 border-dashed p-6 rounded-xl text-center space-y-4 transition-colors ${(errors as any).heroBgFile ? 'border-red-500/50 bg-red-500/5' : 'border-neutral-700 hover:border-neutral-600'}`}>
                      {initialSettings.heroBgUrl && <img src={initialSettings.heroBgUrl} className="h-40 mx-auto rounded-lg object-cover shadow-xl border border-neutral-700" />}
                      <input 
                        type="file" 
                        {...register('heroBgFile' as any, {
                          validate: (files: any) => !files?.[0] || files[0].size <= MAX_FILE_SIZE || FILE_SIZE_ERROR
                        })} 
                        accept="image/*" 
                        className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 transition-all cursor-pointer" 
                      />
                    </div>
                    {(errors as any).heroBgFile && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{(errors as any).heroBgFile.message as string}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6 pt-8 border-t border-neutral-800">
              <h3 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Textos Base del Header & Footer</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Nombre Comercial (Header)</label>
                  <input {...register('headerText')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Descripción Corporativa (Footer)</label>
                  <textarea {...register('footerText')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700 h-28" />
                </div>
              </div>
            </div>
          </section>

          {/* CONTACTO & LEGALES */}
          <section className={`p-8 space-y-8 ${currentTab !== 'contacto' ? 'hidden' : 'block'}`}>
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Información de Contacto Directo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Email Público</label>
                  <input type="email" {...register('contactEmail')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Teléfono Principal</label>
                  <input {...register('contactPhone')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">WhatsApp (+569...)</label>
                  <input {...register('whatsappPhone')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Dirección Matriz</label>
                  <input {...register('address')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Google Maps Embed URL</label>
                  <input {...register('mapEmbedUrl')} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700 font-mono text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-neutral-800">
              <h3 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Contenido Legal Institucional</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Términos Comerciales (Servicios)</label>
                  <textarea {...register('legalTerms')} className="w-full bg-neutral-800 text-white p-4 rounded-lg border border-neutral-700 h-60 text-sm font-light leading-relaxed whitespace-pre-wrap" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Política de Privacidad (Datos)</label>
                  <textarea {...register('legalPrivacy')} className="w-full bg-neutral-800 text-white p-4 rounded-lg border border-neutral-700 h-60 text-sm font-light leading-relaxed whitespace-pre-wrap" />
                </div>
              </div>
            </div>
          </section>

          {/* AVANZADO & SISTEMA - PROTEGIDO */}
          {isDeveloper && (
            <section className={`p-8 space-y-10 ${currentTab !== 'avanzado' ? 'hidden' : 'block'}`}>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Control de Visibilidad (Feature Toggles)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'showHero', label: 'Mostrar Hero' },
                    { id: 'showServices', label: 'Módulo Servicios' },
                    { id: 'showClients', label: 'Módulo Clientes' },
                    { id: 'showMetrics', label: 'Módulo Métricas' },
                    { id: 'showIndustrialCTA', label: 'CTA Industrial' },
                  ].map(toggle => (
                    <label key={toggle.id} className="flex items-center justify-between p-4 bg-neutral-800/40 rounded-xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-all group">
                      <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{toggle.label}</span>
                      <input type="checkbox" {...register(toggle.id as any)} className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-neutral-800">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white border-b border-neutral-800 pb-2">Firma del Desarrollador</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Texto de Firma</label>
                      <input {...register('devSignature')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Enlace (URL)</label>
                      <input {...register('devSignatureUrl')} className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700 text-xs font-mono" />
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20 space-y-6">
                  <h3 className="text-xl font-bold text-red-500 border-b border-red-500/10 pb-2 flex items-center gap-2">
                    <MonitorOff className="w-5 h-5" />
                    Zona Crítica: Mantenimiento
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20 cursor-pointer">
                      <input type="checkbox" {...register('maintenance')} className="w-6 h-6 accent-red-500 cursor-pointer" />
                      <div>
                        <span className="block font-bold text-red-400">Activar Modo Mantenimiento</span>
                        <span className="text-[10px] text-red-500/70 uppercase font-black">BLOQUEO TOTAL DEL FRONTEAD</span>
                      </div>
                    </label>
                    <div>
                      <label className="block text-xs font-bold text-red-500/50 uppercase mb-2">Mensaje en Pantalla de Bloqueo</label>
                      <textarea {...register('maintenanceText')} className="w-full bg-neutral-950/50 text-white p-3 rounded-lg border border-red-500/20 h-28 focus:border-red-500 outline-none transition-all placeholder:text-red-900/40" placeholder="Ej: Estamos optimizando nuestra planta digital. Volvemos pronto." />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </form>
    </div>
  )
}

export default function GlobalConfigForm(props: { 
  initialSettings: SiteSettings
  role: 'DEVELOPER' | 'OWNER'
  flags: { allowEditContact: boolean, allowEditHero: boolean }
  developerTenantId?: string
}) {
  return (
    <Suspense fallback={<div className="p-10 text-center animate-pulse text-neutral-500">Cargando panel de configuración...</div>}>
      <ConfigFormContent {...props} />
    </Suspense>
  )
}