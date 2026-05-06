'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

export interface CommercialPopupProps {
  title: string;
  text?: string | null;
  buttonText?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  isPreview?: boolean;
}

export function CommercialPopupClient({
  title,
  text,
  buttonText,
  url,
  imageUrl,
  isActive = true,
  isPreview = false,
}: CommercialPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isPreview) {
      setIsVisible(true);
      return;
    }

    if (!isActive) return;

    // Simple delay-based trigger for mobile/desktop fallback
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isActive, isPreview]);

  if (!isActive && !isPreview) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className={isPreview ? "absolute inset-0 z-50 flex items-center justify-center p-4 overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"}>
          {!isPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVisible(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-lg bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col ${isPreview ? 'max-h-full' : ''}`}
          >
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-md"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {imageUrl && (
              <div className="relative w-full aspect-video bg-zinc-950 flex-shrink-0">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              </div>
            )}

            <div className={`p-6 md:p-8 flex flex-col items-center text-center ${imageUrl ? 'pt-2' : ''} overflow-y-auto`}>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">
                {title}
              </h2>
              
              {text && (
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                  {text}
                </p>
              )}

              {buttonText && url && (
                <Link
                  href={url}
                  onClick={(e) => {
                    if (isPreview) e.preventDefault();
                    else setIsVisible(false);
                  }}
                  className="w-full bg-[#ea580c] hover:bg-orange-600 active:scale-95 text-white font-black py-4 px-8 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-orange-950/50"
                >
                  {buttonText}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
