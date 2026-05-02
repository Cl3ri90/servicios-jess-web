'use client'

import { useState } from 'react'
import { createDocument, updateDocument, deleteDocument } from '@/lib/actions/documents'
import { FileText, Plus, Trash2, Edit3, Check, X } from 'lucide-react'

interface Doc {
  id: string
  title: string
  description?: string | null
  category: string
  fileUrl: string
  isPublic: boolean
  order: number
}

interface Props {
  initialDocs: Doc[]
}

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'brochure', label: 'Brochure' },
  { value: 'ficha_tecnica', label: 'Ficha Técnica' },
  { value: 'catalogo', label: 'Catálogo' },
  { value: 'certificacion', label: 'Certificación' },
  { value: 'comercial', label: 'Documento Comercial' },
]

const inputClass = "w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-neutral-500"
const labelClass = "block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1"

export function DescargasClient({ initialDocs }: Props) {
  const [docs, setDocs] = useState<Doc[]>(initialDocs)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showStatus = (type: 'success' | 'error', msg: string) => {
    setStatus({ type, msg })
    setTimeout(() => setStatus(null), 3000)
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const res = await createDocument(formData)
    if (res.error) showStatus('error', res.error)
    else {
      showStatus('success', res.success!)
      setShowAddForm(false)
      window.location.reload()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este documento?')) return
    const res = await deleteDocument(id)
    if (res.error) showStatus('error', res.error)
    else {
      showStatus('success', res.success!)
      setDocs(prev => prev.filter(d => d.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Status bar */}
      {status && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-950 border border-green-800 text-green-400' : 'bg-red-950 border border-red-800 text-red-400'}`}>
          {status.msg}
        </div>
      )}

      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg text-sm uppercase tracking-wider transition-all"
        >
          <Plus className="w-4 h-4" />
          Añadir Documento
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 space-y-4">
          <h3 className="text-white font-bold">Nuevo Documento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Título *</label>
              <input name="title" required className={inputClass} placeholder="Ficha técnica goma SBR 60 Shore" />
            </div>
            <div>
              <label className={labelClass}>Categoría</label>
              <select name="category" className={inputClass} defaultValue="ficha_tecnica">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>URL del archivo (Supabase Storage o URL pública) *</label>
              <input name="fileUrl" required className={inputClass} placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descripción breve</label>
              <input name="description" className={inputClass} placeholder="Ficha de propiedades mecánicas y térmicas" />
            </div>
            <div>
              <label className={labelClass}>Orden</label>
              <input name="order" type="number" className={inputClass} defaultValue="0" />
            </div>
            <div>
              <label className={labelClass}>Visibilidad pública</label>
              <select name="isPublic" className={inputClass} defaultValue="true">
                <option value="true">Visible en el sitio</option>
                <option value="false">Oculto</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowAddForm(false)} className="text-neutral-400 hover:text-white text-sm transition-colors">Cancelar</button>
            <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-lg text-sm uppercase tracking-wider transition-all">
              Guardar
            </button>
          </div>
        </form>
      )}

      {/* Documents list */}
      {docs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl text-neutral-500">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-light">Aún no hay documentos. Añade el primero.</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-800/30 transition-colors">
              <div className="w-10 h-10 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{doc.title}</p>
                <p className="text-neutral-500 text-xs mt-0.5">
                  {CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                  {!doc.isPublic && <span className="ml-2 text-yellow-600">· Oculto</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-white transition-colors border border-neutral-700 hover:border-neutral-500 px-3 py-1.5 rounded">
                  Ver
                </a>
                <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-950 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
