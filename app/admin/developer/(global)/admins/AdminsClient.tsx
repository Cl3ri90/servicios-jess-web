'use client'

import { useState, useRef } from 'react'
import { createGlobalAdmin, deleteGlobalAdmin, toggleGlobalAdminStatus } from '@/lib/actions/dev-admins'
import { UserPlus, ShieldAlert, Trash2, CheckCircle2, X } from 'lucide-react'

type Admin = any

export function AdminsClient({ initialAdmins, currentUserId }: { initialAdmins: Admin[], currentUserId: string }) {
  const [showModal, setShowModal] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const res = await createGlobalAdmin(formData)
    
    if (res.error) {
      setFormError(res.error)
      setIsSubmitting(false)
    } else {
      setShowModal(false)
      window.location.reload()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este administrador global? Perderá acceso a la plataforma.')) return
    const res = await deleteGlobalAdmin(id)
    if (res.error) alert(res.error)
    else window.location.reload()
  }

  async function handleToggle(id: string, active: boolean) {
    const res = await toggleGlobalAdminStatus(id, active)
    if (res.error) alert(res.error)
    else window.location.reload()
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-[#112240] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-duet-primary dark:text-blue-400 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equipo de Super Administradores</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Usuarios con acceso total a Tenants y Configuración.</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-duet-primary hover:bg-blue-900 text-white font-bold py-2.5 px-5 rounded-lg text-sm shadow-md transition-all hover:shadow-lg">
          <UserPlus className="w-4 h-4" /> Agregar Admin
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">Nuevo Admin</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            {formError && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">{formError}</div>}
            
            <form ref={formRef} onSubmit={handleCreate} className="space-y-5">
               <div>
                  <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5">Nombre (Opcional)</label>
                  <input name="name" placeholder="Ej: Carlos Developer" className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-duet-primary outline-none transition-all" />
               </div>
               <div>
                  <label className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5">Correo Electrónico *</label>
                  <input type="email" name="email" required placeholder="correo@duetsolutions.cl" className="w-full bg-slate-50 dark:bg-[#0a192f] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-duet-primary outline-none transition-all" />
                  <p className="text-[10px] text-slate-400 mt-1.5">Se creará un perfil pasivo y se activará al iniciar sesión con este correo.</p>
               </div>
               
               <div className="flex justify-end gap-3 mt-8 pt-4">
                 <button type="button" onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-white font-medium text-sm px-4 py-2 transition-colors">Cancelar</button>
                 <button type="submit" disabled={isSubmitting} className="bg-duet-primary hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all">
                   {isSubmitting ? 'Agregando...' : 'Agregar Autorización'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
           <thead className="bg-slate-50 dark:bg-[#0a192f] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400">Usuario</th>
                <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400">Estado</th>
                <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400">Fecha Registro</th>
                <th className="px-6 py-4 uppercase text-[10px] font-black tracking-widest text-right text-slate-500 dark:text-slate-400">Acciones</th>
              </tr>
           </thead>
           <tbody>
             {initialAdmins.map((admin) => {
               const isMe = admin.id === currentUserId
               return (
                 <tr key={admin.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                   <td className="px-6 py-4">
                     <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                       {admin.name || 'Sin nombre'}
                       {isMe && <span className="bg-duet-accent text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Tú</span>}
                     </p>
                     <p className="text-xs text-slate-500 font-mono mt-0.5">{admin.email}</p>
                   </td>
                   <td className="px-6 py-4">
                     <button 
                       onClick={() => handleToggle(admin.id, admin.isActive)}
                       className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${admin.isActive ? 'bg-green-50 dark:bg-duet-green/10 text-green-700 dark:text-duet-green hover:bg-green-100 dark:hover:bg-duet-green/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20'}`}
                     >
                       <span className={`w-2 h-2 rounded-full ${admin.isActive ? 'bg-green-500 dark:bg-duet-green' : 'bg-red-500'}`}></span>
                       {admin.isActive ? 'Operativo' : 'Desactivado'}
                     </button>
                   </td>
                   <td className="px-6 py-4 text-xs text-slate-500">
                     {new Date(admin.createdAt).toLocaleDateString()}
                   </td>
                   <td className="px-6 py-4 flex justify-end">
                     <div>
                       <button 
                         onClick={() => handleDelete(admin.id)}
                         className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                         title="Eliminar Administrador"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </td>
                 </tr>
               )
             })}
           </tbody>
        </table>
      </div>
    </div>
  )
}
