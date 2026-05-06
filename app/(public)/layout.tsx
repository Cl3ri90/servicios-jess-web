import { getSiteConfig } from '@/lib/site/get-site-config';
import { getMainCtaConfig } from '@/lib/site/get-main-cta';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { FloatingCTAWrapper } from '@/components/site/floating-cta';
import { MainCtaWrapper } from '@/components/site/main-cta-wrapper';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata() {
  const { config } = await getSiteConfig();
  
  return {
    title: {
      template: `%s | ${config?.name || 'Servicios Jess'}`,
      default: config?.metaTitle || config?.name || 'Servicios Jess',
    },
    description: config?.metaDescription || 'Ingeniería y soluciones industriales de alto nivel.',
    icons: {
      icon: config?.faviconUrl || '/favicon.ico',
      shortcut: config?.faviconUrl || '/favicon.ico',
      apple: config?.faviconUrl || '/apple-touch-icon.png',
    },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { config, activeFlags } = await getSiteConfig();
  const mainCtaConfig = await getMainCtaConfig();

  return (
    <>
      <Navbar 
        brandName={config?.name || 'SERVICIOS JESS'} 
        logoUrl={config?.logoUrl}
        activeFlags={activeFlags} 
      />
      <main className="flex-1 pt-0">
        {children}
      </main>
      <MainCtaWrapper config={mainCtaConfig} activeFlags={activeFlags} />
      <FloatingCTAWrapper />
      <Footer 
        brandName={config?.name || 'SERVICIOS JESS'}
        email={config?.contactEmail || null}
        phone={config?.contactPhone || null}
        address={config?.contactAddress || null}
        logoUrl={config?.logoUrl}
        devSignature={config?.devSignature}
        devSignatureUrl={config?.devSignatureUrl}
      />
    </>
  );
}
