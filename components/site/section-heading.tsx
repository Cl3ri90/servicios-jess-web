type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  overline?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ title, subtitle, overline, align = 'left' }: SectionHeadingProps) {
  const isCenter = align === 'center';
  
  return (
    <div className={`mb-16 ${isCenter ? 'flex flex-col items-center text-center' : ''}`}>
      {overline && (
        <div className={`flex items-center gap-4 mb-6 ${isCenter ? 'justify-center' : ''}`}>
          <span className="text-[#ea580c] text-3xl font-black leading-none italic select-none">/</span>
          <span className="text-white font-black text-2xl tracking-tighter">
            {overline}
          </span>
        </div>
      )}
      
      {title && (
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.05]">
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className={`text-zinc-400 text-lg md:text-xl leading-relaxed ${isCenter ? 'max-w-3xl text-center' : 'max-w-2xl'} font-medium`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
