import { getPublicTechnicalSheets } from '@/lib/site/get-technical-sheets';
import { notFound } from 'next/navigation';
import { FileText, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FichasTecnicasPublicPage() {
  const sheets = await getPublicTechnicalSheets();
  
  // Si nos devuelve null/vacio estricto, o simplemente decidimos mostrar el view vacio
  if (!sheets || sheets.length === 0) {
     return (
       <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
            <FileText className="w-10 h-10 text-zinc-600" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Catálogo de Fichas</h1>
          <p className="text-zinc-500 max-w-md text-center">Los documentos técnicos no se encuentran disponibles públicamente en este momento. Inténtalo más tarde.</p>
       </div>
     );
  }

  // Agrupación local por categoría
  const groupedSheets = sheets.reduce((acc: any, sheet: any) => {
    const cat = sheet.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sheet);
    return acc;
  }, {});

  return (
    <div className="bg-zinc-950 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        
        <div className="mb-12 border-b border-zinc-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Catálogo de Fichas<span className="text-orange-500">.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Descarga directamente las especificaciones técnicas, manuales y catálogos en formato PDF para tus proyectos industriales.
          </p>
        </div>

        <div className="space-y-16">
          {Object.keys(groupedSheets).map((categoryName) => (
            <div key={categoryName}>
              <div className="flex items-center gap-4 mb-6">
                 <h2 className="text-2xl font-bold tracking-tight text-white">{categoryName}</h2>
                 <div className="h-px bg-zinc-800 flex-1 mt-1"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {groupedSheets[categoryName].map((sheet: any) => (
                   <div key={sheet.id} className="group border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 transition-all rounded-2xl overflow-hidden flex flex-col h-full">
                      
                      {sheet.coverImageUrl ? (
                        <div className="w-full h-48 bg-zinc-900 overflow-hidden relative">
                           <img 
                             src={sheet.coverImageUrl} 
                             alt={sheet.title} 
                             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80"></div>
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-zinc-900 flex items-center justify-center opacity-50 relative overflow-hidden">
                           <FileText className="w-16 h-16 text-zinc-800 absolute -right-4 -bottom-4 transform rotate-12" />
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col">
                         <div className="flex-1 mb-6">
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
                              {sheet.title}
                            </h3>
                            {sheet.description && (
                              <p className="text-sm text-zinc-400 line-clamp-3">
                                {sheet.description}
                              </p>
                            )}
                         </div>

                         <a 
                           href={sheet.fileUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center justify-between w-full border border-zinc-700 bg-zinc-950 hover:bg-orange-600 hover:border-orange-500 hover:text-white text-zinc-300 font-mono text-xs px-4 py-3 rounded-xl transition-all"
                         >
                            <span className="font-bold tracking-widest uppercase">Descargar PDF</span>
                            <div className="flex items-center gap-2">
                               <span className="opacity-50">
                                 {sheet.fileSize ? `${(sheet.fileSize / 1024 / 1024).toFixed(1)}MB` : 'DOC'}
                               </span>
                               <Download className="w-4 h-4" />
                            </div>
                         </a>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
