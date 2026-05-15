import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

import { getSiteConfig } from '@/lib/site/get-site-config';

export async function generateMetadata() {
  const { config } = await getSiteConfig();
  return {
    metadataBase: new URL('https://www.serviciosjess.cl'),
    title: config?.metaTitle || config?.name || 'Servicios Jess | Gomas industriales, plásticos de ingeniería y maestranza',
    description: config?.metaDescription || 'Expertos en gomas industriales, plásticos de ingeniería y maestranza. Fabricamos soluciones técnicas a medida para empresas e industrias.',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} dark scroll-smooth`}>
      <body className="min-h-screen font-sans antialiased bg-neutral-950 text-neutral-100 flex flex-col selection:bg-[var(--color-primary)] selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
