'use client';

import { useState } from 'react';
import { updateMainCtaConfig } from '@/lib/actions/main-cta';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Trash2 } from 'lucide-react';
import { MainCtaSection } from '@/components/site/main-cta-section';

export function MainCtaForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState({
    eyebrow: initialData?.eyebrow || 'SOLUCIONES INDUSTRIALES',
    titleLine1: initialData?.titleLine1 || '¿Proyectos de Alta Exigencia?',
    titleHighlight: initialData?.titleHighlight || 'Fabricamos las Respuestas.',
    description: initialData?.description || 'Envíanos tus planos o requerimientos técnicos. Nuestro equipo B2B cotizará y proyectará tu solución metalmecánica en 24 horas.',
    buttonText: initialData?.buttonText || 'Iniciar Proyecto',
    buttonUrl: initialData?.buttonUrl || '/contacto',
    backgroundColor: initialData?.backgroundColor || '#0a0a0a',
    textColor: initialData?.textColor || '#ffffff',
    accentColor: initialData?.accentColor || '#ea580c',
    overlayOpacity: initialData?.overlayOpacity || 80,
    backgroundImageUrl: initialData?.backgroundImageUrl || null,
    alignment: initialData?.alignment || 'center',
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.backgroundImageUrl || null);
  const [removeBg, setRemoveBg] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (removeBg) formData.append('removeBg', 'true');

    try {
      const res = await updateMainCtaConfig(null, formData);
      if (res?.success) {
        toast.success(res.message);
        if (removeBg) {
          setPreviewImage(null);
          setRemoveBg(false);
        }
      } else {
        toast.error(res?.error || 'Error al guardar');
      }
    } catch (err) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPreviewData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-12">
      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-black mb-8">
        <div className="bg-zinc-900/50 p-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Vista Previa en Vivo</span>
        </div>
        <div className="pointer-events-none">
          <MainCtaSection config={{ ...previewData, backgroundImageUrl: previewImage }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-[#ea580c] font-black uppercase tracking-widest text-xs border-b border-zinc-800 pb-2">Configuración Principal</h3>
            
            <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <input type="checkbox" name="isEnabled" id="isEnabled" defaultChecked={initialData?.isEnabled ?? true} className="w-5 h-5 accent-[#ea580c] bg-zinc-900 border-zinc-700" />
              <label htmlFor="isEnabled" className="text-sm font-medium text-white cursor-pointer">Activar Sección CTA Público</label>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Eyebrow (Opcional)</label>
              <input name="eyebrow" type="text" defaultValue={initialData?.eyebrow} onChange={handlePreviewChange} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-[#ea580c] outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Título Principal (Línea 1)</label>
              <input name="titleLine1" type="text" required defaultValue={initialData?.titleLine1} onChange={handlePreviewChange} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-[#ea580c] outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Título Destacado (Naranja)</label>
              <input name="titleHighlight" type="text" required defaultValue={initialData?.titleHighlight} onChange={handlePreviewChange} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-[#ea580c] outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Descripción</label>
              <textarea name="description" required rows={3} defaultValue={initialData?.description} onChange={handlePreviewChange} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-[#ea580c] outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Texto Botón</label>
                <input name="buttonText" type="text" required defaultValue={initialData?.buttonText} onChange={handlePreviewChange} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-[#ea580c] outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">URL Destino</label>
                <input name="buttonUrl" type="text" required defaultValue={initialData?.buttonUrl} onChange={handlePreviewChange} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-[#ea580c] outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[#ea580c] font-black uppercase tracking-widest text-xs border-b border-zinc-800 pb-2">Diseño y Visibilidad</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Fondo</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name="backgroundColor" defaultValue={initialData?.backgroundColor || '#0a0a0a'} onChange={handlePreviewChange} className="w-8 h-8 rounded bg-black border border-zinc-800 cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Texto</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name="textColor" defaultValue={initialData?.textColor || '#ffffff'} onChange={handlePreviewChange} className="w-8 h-8 rounded bg-black border border-zinc-800 cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Acento</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name="accentColor" defaultValue={initialData?.accentColor || '#ea580c'} onChange={handlePreviewChange} className="w-8 h-8 rounded bg-black border border-zinc-800 cursor-pointer" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Imagen de Fondo (Opcional)</label>
              <div className="flex gap-4 items-start">
                {previewImage && !removeBg ? (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-zinc-800 group">
                    <img src={previewImage} alt="Fondo" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setRemoveBg(true); setPreviewImage(null); }} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center bg-black/50">
                    <ImageIcon className="w-6 h-6 text-zinc-600" />
                  </div>
                )}
                <div className="flex-1">
                  <input type="file" name="bgFile" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPreviewImage(URL.createObjectURL(e.target.files[0]));
                      setRemoveBg(false);
                    }
                  }} className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-black file:uppercase file:bg-zinc-800 file:text-[#ea580c] hover:file:bg-zinc-700 transition-all cursor-pointer w-full" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Opacidad Overlay (%)</label>
                 <input name="overlayOpacity" type="number" min="0" max="100" defaultValue={initialData?.overlayOpacity || 80} onChange={handlePreviewChange} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-[#ea580c] outline-none" />
              </div>
              <div>
                 <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Alineación</label>
                 <select name="alignment" defaultValue={initialData?.alignment || 'center'} onChange={handlePreviewChange} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-[#ea580c] outline-none">
                    <option value="center">Centrado</option>
                    <option value="left">Izquierda</option>
                 </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 mt-4">Mostrar en Páginas</label>
              <div className="grid grid-cols-2 gap-3 bg-black p-4 rounded-lg border border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="showOnHome" defaultChecked={initialData?.showOnHome ?? true} className="w-4 h-4 accent-[#ea580c] bg-zinc-900 border-zinc-700" />
                  <span className="text-xs text-zinc-300 uppercase tracking-wider">Inicio</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="showOnEmpresa" defaultChecked={initialData?.showOnEmpresa ?? false} className="w-4 h-4 accent-[#ea580c] bg-zinc-900 border-zinc-700" />
                  <span className="text-xs text-zinc-300 uppercase tracking-wider">Empresa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="showOnServicios" defaultChecked={initialData?.showOnServicios ?? false} className="w-4 h-4 accent-[#ea580c] bg-zinc-900 border-zinc-700" />
                  <span className="text-xs text-zinc-300 uppercase tracking-wider">Servicios</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="showOnPortfolio" defaultChecked={initialData?.showOnPortfolio ?? false} className="w-4 h-4 accent-[#ea580c] bg-zinc-900 border-zinc-700" />
                  <span className="text-xs text-zinc-300 uppercase tracking-wider">Portafolio</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#ea580c] hover:bg-orange-600 text-white px-8 py-3 rounded-sm font-black uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(234,88,12,0.15)] disabled:opacity-50"
          >
            {loading ? 'Guardando...' : (
              <>
                <Save className="w-4 h-4" /> Guardar Configuración
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
