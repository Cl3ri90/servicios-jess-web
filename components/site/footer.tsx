import Link from 'next/link';

type FooterProps = {
  brandName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  logoUrl?: string | null;
  description?: string | null;
  devSignature?: string | null;
  devSignatureUrl?: string | null;
};

export function Footer({ brandName, email, phone, address, logoUrl, description, devSignature, devSignatureUrl }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 pt-20 pb-10">
      <div className="container max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-6 opacity-30">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo Footer" className="h-8 object-contain grayscale" />
                ) : (
                  <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center font-black text-white rounded-sm transform -skew-x-12">
                    <span className="skew-x-12">{brandName?.charAt(0) || 'SJ'}</span>
                  </div>
                )}
                <span className="text-xl font-bold tracking-[0.2em] text-white uppercase">{brandName || 'SERVICIOS JESS'}</span>
             </div>
             <p className="text-neutral-500 max-w-sm mb-8 leading-relaxed font-light">
               {description || 'Fabricantes de gomas industriales, plásticos de ingeniería y maestranza.'}
             </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-sm">Menú Principal</h4>
            <nav className="flex flex-col gap-4 text-neutral-400 text-sm font-light">
              <Link href="/" className="hover:text-white hover:translate-x-1 transition-all uppercase tracking-wider text-xs">Inicio</Link>
              <Link href="/empresa" className="hover:text-white hover:translate-x-1 transition-all uppercase tracking-wider text-xs">Quiénes Somos</Link>
              <Link href="/servicios" className="hover:text-white hover:translate-x-1 transition-all uppercase tracking-wider text-xs">Capacidades Técnicas</Link>
              <Link href="/portafolio" className="hover:text-white hover:translate-x-1 transition-all uppercase tracking-wider text-xs">Proyectos Clave</Link>
            </nav>
          </div>
          
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-sm">Contacto</h4>
            <ul className="flex flex-col gap-4 text-neutral-400 text-sm font-light">
              {address && (
                <li className="flex gap-3">
                  <span className="text-[#ea580c]">📍</span>
                  <span>{address.split(',').map((line, i) => <span key={i}>{line}<br/></span>)}</span>
                </li>
              )}
              {phone && (
                <li className="flex gap-3">
                   <span className="text-[#ea580c]">📞</span>
                   <span><a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a></span>
                </li>
              )}
              {email && (
                <li className="flex gap-3">
                   <span className="text-[#ea580c]">✉️</span>
                   <span><a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a></span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-600 tracking-wider">
           <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
             <p>© {currentYear} {brandName}. Todos los derechos reservados.</p>
             {devSignature && (
               <p className="opacity-70">
                 {devSignatureUrl ? (
                   <a href={devSignatureUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                     {devSignature}
                   </a>
                 ) : (
                   devSignature
                 )}
               </p>
             )}
           </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/politicas-de-privacidad" className="hover:text-neutral-400 tracking-widest uppercase text-[10px]">Políticas de Privacidad</Link>
              <Link href="/terminos-comerciales" className="hover:text-neutral-400 tracking-widest uppercase text-[10px]">Términos Comerciales</Link>
             <Link href="/admin" className="hover:text-[#ea580c] ml-4 border-l border-neutral-800 pl-4 py-1 tracking-widest uppercase text-[10px] font-bold">Portal Admin</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
