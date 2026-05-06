import Link from 'next/link';

export function MainCtaSection({ config }: { config: any }) {
  if (!config || config.isEnabled === false) return null;

  const {
    eyebrow,
    titleLine1,
    titleHighlight,
    description,
    buttonText,
    buttonUrl,
    backgroundColor,
    textColor,
    accentColor,
    backgroundImageUrl,
    overlayOpacity,
    alignment,
  } = config;

  const isLeftAlign = alignment === 'left';
  const overlayValue = overlayOpacity !== undefined ? overlayOpacity / 100 : 0.8;

  return (
    <section 
      className="w-full py-24 md:py-32 relative border-y border-white/5 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Background Image & Overlay */}
      {backgroundImageUrl ? (
        <>
          <img 
            src={backgroundImageUrl} 
            alt="Fondo CTA" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: '#000000', opacity: overlayValue }}
          />
        </>
      ) : (
        /* Fallback glow if no image */
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" 
          style={{ backgroundColor: accentColor }}
        />
      )}
      
      <div className={`max-w-4xl mx-auto px-6 relative z-10 w-full ${isLeftAlign ? 'text-left' : 'text-center'}`}>
        
        {eyebrow && (
           <span 
             className="block mb-4 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase"
             style={{ color: accentColor }}
           >
             {eyebrow}
           </span>
        )}

        <h2 
          className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.05]"
          style={{ color: textColor }}
        >
          {titleLine1}
          <span className="block mt-2" style={{ color: accentColor }}>
            {titleHighlight}
          </span>
        </h2>
        
        <p 
          className={`text-lg md:text-xl font-medium mb-10 leading-relaxed ${isLeftAlign ? 'mr-auto max-w-2xl' : 'mx-auto max-w-2xl'}`}
          style={{ color: textColor, opacity: 0.8 }}
        >
          {description}
        </p>

        <Link
          href={buttonUrl}
          className="inline-flex h-14 items-center justify-center font-black text-sm tracking-widest uppercase rounded-sm transition-all duration-300 px-10 md:px-12 w-full md:w-auto"
          style={{ 
            backgroundColor: accentColor, 
            color: '#fff',
            boxShadow: `0 0 20px ${accentColor}33`
          }}
          onMouseEnter={(e) => {
             e.currentTarget.style.boxShadow = `0 0 40px ${accentColor}80`;
             e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
             e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}33`;
             e.currentTarget.style.opacity = '1';
          }}
        >
          {buttonText} <span className="ml-3 text-2xl font-normal leading-none mb-1">→</span>
        </Link>
      </div>
    </section>
  );
}
