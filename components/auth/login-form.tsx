'use client';

import { useState } from 'react';
import { loginAction } from '@/lib/actions/auth';

type LoginFormProps = {
  logoUrl?: string | null;
};

export function LoginForm({ logoUrl }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado al intentar iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-[var(--color-primary)]/30">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-8 rounded-sm shadow-2xl relative z-10 glass">
        <div className="flex justify-center mb-6 h-16 w-24 mx-auto items-center">
           {logoUrl ? (
             <img 
                src={logoUrl} 
                alt="Servicios Jess" 
                className="h-14 w-auto object-contain mx-auto"
                onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   const nextSibling = e.currentTarget.nextElementSibling;
                   if (nextSibling) {
                     nextSibling.classList.remove('hidden');
                   }
                }}
             />
           ) : null}
           <div className={`${logoUrl ? 'hidden' : 'flex'} w-12 h-10 bg-neutral-800 rounded-sm items-center justify-center transform -skew-x-12 border border-white/20 mx-auto`}>
              <span className="skew-x-12 text-lg font-black text-white italic tracking-tighter">SJ</span>
           </div>
        </div>
        
        <h1 className="text-xl font-bold text-center text-white mb-6 uppercase tracking-widest">
          SISTEMA GESTIÓN <span className="block text-[var(--color-primary)] mt-1">NÚCLEO B2B</span>
        </h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-sm text-sm mb-4 font-medium backdrop-blur-sm">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Credenciales (Email)</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm font-medium"
              placeholder="admin@empresa.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Token de Seguridad (Pass)</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm font-medium"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white font-black py-4 rounded-sm transition-all mt-8 uppercase tracking-widest text-xs flex justify-center items-center gap-2"
          >
            {loading ? 'AUTENTICANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>

      <div className="mt-8 text-neutral-600 text-[10px] uppercase tracking-widest font-mono">
        Conexión Cifrada / Portal Restringido
      </div>
    </div>
  );
}
