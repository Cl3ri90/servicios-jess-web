import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Servicios Jess SpA',
  description: 'Maestranza Avanzada y Servicios Industriales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} dark scroll-smooth`}>
      <body className="min-h-screen font-sans antialiased bg-neutral-950 text-neutral-100 flex flex-col selection:bg-[var(--color-primary)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
