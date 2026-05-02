'use client'

import { useState, useEffect, useRef } from 'react'
import { toggleTenantFlag, createTenant, setPreviewTenant, runPhase5Backfill } from '@/lib/actions/dev-tenant'
import { CheckCircle, XCircle, ExternalLink, Plus, Database } from 'lucide-react'
import { DeleteTenantButton } from '@/components/admin/DeleteTenantButton'

type Tenant = any // Any for now due to IDE prisma cache

export function TenantListClient({ initialTenants }: { initialTenants: Tenant[] }) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants)
  const [loading, setLoading] = useState<string | null>(null) // tenantId-flag
  const [mounted, setMounted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleToggle = async (tenantId: string, flag: string, currentValue: boolean) => {
    const loaderId = `${tenantId}-${flag}`
    setLoading(loaderId)
    try {
      await toggleTenantFlag(tenantId, flag as any, !currentValue)
      // Update local state optimistic/pessimistic
      setTenants(prev => prev.map(t => {
        if (t.id === tenantId) {
          return {
            ...t,
            legacyFeatureFlags: {
              ...t.legacyFeatureFlags,
              [flag]: !currentValue
            }
          }
        }
        return t
      }))
    } catch (err) {
      alert('Error updating flag.')
    } finally {
      setLoading(null)
    }
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    try {
      const res = await createTenant(formData)
      if (res.error) setFormError(res.error)
      else if (res.success) {
         setShowModal(false)
         window.location.reload()
      }
    } catch (err) {
      setFormError('Error al crear tenant. Intenta con otro slug.')
    }
    setIsSubmitting(false)
  }

  const handleBackfill = async () => {
    if (!confirm('¿Deseas normalizar todos los tenants existentes? Esto creará registros de configuración vacíos donde no existan.')) return
    setIsSubmitting(true)
    try {
      const res = await runPhase5Backfill()
      alert((res as any).success || (res as any).error)
      window.location.reload()
    } catch (err) {
      alert('Error en backfill.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const parseDate = (d: any) => new Date(d).toLocaleDateString()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <Database className="w-4 h-4" />
          <span>Mantenimiento del Sistema</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleBackfill}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2 px-4 rounded border border-neutral-700 transition-all text-xs uppercase disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" />
            Backfill Phase 5
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded shadow-lg transition-all uppercase tracking-wider text-xs">
            <Plus className="w-4 h-4" /> Registrar Nuevo Tenant
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Nuevo Tenant</h3>
            
            {formError && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">{formError}</div>}
            
            <form ref={formRef} onSubmit={handleCreate} className="space-y-5">
               <div>
                  <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5">Nombre Empresa</label>
                  <input name="name" required placeholder="Ej: Clínica Dental Smile" className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-duet-primary outline-none transition-all" />
               </div>
               <div>
                  <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5">Slug (Dominio Virtual)</label>
                  <input name="slug" required placeholder="ej: clinica-smile" className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-duet-primary outline-none transition-all" />
                  <p className="text-[10px] text-slate-400 mt-1.5">Debe ser único. Minúsculas, números y guiones.</p>
               </div>
               <div className="grid grid-cols-1 gap-4">
                 <div>
                    <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5">Nivel de Suscripción</label>
                    <select name="subscriptionTier" required className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-duet-primary outline-none transition-all appearance-none cursor-pointer">
                       <option value="BASIC">Básico (Limitado, sin pagos/wsp)</option>
                       <option value="PRO">Pro (Wsp, Pagos, Intermedio)</option>
                       <option value="PREMIUM">Premium (Full features)</option>
                    </select>
                 </div>
               </div>
               
               <div className="flex justify-end gap-3 mt-8 pt-4">
                 <button type="button" onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-white font-medium text-sm px-4 py-2 transition-colors">Cancelar</button>
                 <button type="submit" disabled={isSubmitting} className="bg-duet-primary hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all">
                   {isSubmitting ? 'Creando...' : 'Crear Modalidad'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {tenants.map(tenant => (
        <div key={tenant.id} className="bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-duet-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-xl z-10 shadow-sm">
            {tenant.plan || 'ESTÁNDAR'}
          </div>
          
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
            <div>
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight group-hover:text-duet-primary dark:group-hover:text-blue-400 transition-colors">{tenant.name}</h3>
              <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mt-1.5">ID: {tenant.id} <span className="mx-2 text-slate-300 dark:text-slate-700">|</span> Slug: <span className="text-duet-accent font-bold">{tenant.slug}</span></p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Registrado: {mounted ? parseDate(tenant.createdAt) : ''}</p>
            </div>
            <div className="flex flex-wrap gap-3 w-full xl:w-auto">
               <button onClick={() => setPreviewTenant(tenant.slug)} className="flex-1 xl:flex-none justify-center items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm font-bold uppercase rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all flex">
                 <ExternalLink className="w-4 h-4" /> Preview Público
               </button>
               <a href={`/admin/developer/t/${tenant.id}/config`} className="flex-1 xl:flex-none text-center px-5 py-2.5 bg-duet-accent hover:bg-orange-500 text-white text-sm font-bold uppercase rounded-lg shadow-md transition-all flex items-center justify-center">
                 Configurar Central
               </a>
               <div className="flex-1 xl:flex-none">
                 <DeleteTenantButton tenantId={tenant.id} tenantSlug={tenant.slug} tenantName={tenant.name} />
               </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0a192f] p-6 rounded-xl border border-slate-100 dark:border-slate-800/60">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-duet-green"></span> Feature Flags Activos
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { key: 'enableWhatsApp', label: 'Mensajería WhatsApp' },
                { key: 'enablePortfolio', label: 'Casos Portafolio' },
                { key: 'enableMetrics', label: 'Métricas Home' },
                { key: 'enableLeads', label: 'Captación Leads' },
                { key: 'enablePopup', label: 'Popup Promocional' },
                { key: 'allowEditContact', label: 'Permitir Edición Contacto' },
                { key: 'allowEditHero', label: 'Permitir Edición Hero' },
                // Phase 5: Commercial Modules
                { key: 'enableSeoManager', label: 'SEO Manager' },
                { key: 'enableAnnouncementBar', label: 'Barra de Anuncio' },
                { key: 'enablePromoPopup', label: 'Smart Popup' },
                { key: 'enableStickyCta', label: 'CTA Flotante' },
                { key: 'enableTechnicalDownloads', label: 'Fichas Técnicas' },
              ].map(flag => {
                const isActive = tenant.legacyFeatureFlags?.[flag.key] === true
                const isLoader = loading === `${tenant.id}-${flag.key}`
                
                return (
                  <button
                    key={flag.key}
                    onClick={() => handleToggle(tenant.id, flag.key, isActive)}
                    disabled={isLoader}
                    className={`flex items-center gap-3 p-3.5 rounded-lg transition-all text-left border ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-duet-primary/10 border-blue-100 dark:border-duet-primary/30 shadow-sm' 
                        : 'bg-white dark:bg-[#112240] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    } ${isLoader ? 'animate-pulse opacity-50' : ''}`}
                  >
                    {isActive ? <CheckCircle className="w-5 h-5 text-duet-primary dark:text-blue-400 shrink-0" /> : <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />}
                    <span className={`text-xs font-bold leading-tight ${isActive ? 'text-duet-primary dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}>{flag.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
