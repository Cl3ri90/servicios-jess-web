import { getSiteConfig } from '@/lib/site/get-site-config';
import { getMainCtaConfig } from '@/lib/site/get-main-cta';
import { getActivePopup } from '@/lib/actions/popup';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { FloatingCTAWrapper } from '@/components/site/floating-cta';
import { MainCtaWrapper } from '@/components/site/main-cta-wrapper';
import { CommercialPopupClient } from '@/components/site/commercial-popup-client';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { AnalyticsTracker } from '@/components/site/analytics-tracker';
import { BackToTopButton } from '@/components/site/BackToTopButton';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata() {
  const { config } = await getSiteConfig();
  
  const title = config?.metaTitle || config?.name || 'Servicios Jess';
  const description = config?.metaDescription || 'Ingeniería y soluciones industriales de alto nivel.';

  return {
    metadataBase: new URL('https://www.serviciosjess.cl'),
    title: {
      template: `%s | ${config?.name || 'Servicios Jess'}`,
      default: title,
    },
    description: description,
    openGraph: {
      title,
      description,
      url: 'https://www.serviciosjess.cl',
      siteName: config?.name || 'Servicios Jess',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
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

  const showPopup = activeFlags.includes('popup_promocional');
  const popup = showPopup ? await getActivePopup() : null;

  const now = new Date();

  const validPopup = popup && popup.isActive && popup.title?.trim() !== '' &&
    (!popup.startsAt || new Date(popup.startsAt) <= now) &&
    (!popup.endsAt || new Date(popup.endsAt) >= now);

  return (
    <>
      <Navbar 
        brandName={config?.name || 'SERVICIOS JESS'} 
        logoUrl={config?.logoUrl}
        activeFlags={activeFlags} 
      />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      <main className="flex-1 pt-0">
        {children}
      </main>
      <MainCtaWrapper config={mainCtaConfig} activeFlags={activeFlags} disableOnHome={true} />
      <FloatingCTAWrapper />
      <BackToTopButton />
      <Footer 
        brandName={config?.name || 'SERVICIOS JESS'}
        email={config?.contactEmail || null}
        phone={config?.contactPhone || null}
        address={config?.contactAddress || null}
        logoUrl={config?.logoUrl}
        description={config?.footerText}
        devSignature={config?.devSignature}
        devSignatureUrl={config?.devSignatureUrl}
      />
      {validPopup && (
        <CommercialPopupClient 
          title={popup.title}
          text={popup.text}
          buttonText={popup.buttonText}
          url={popup.url}
          imageUrl={popup.imageUrl}
          isActive={true}
        />
      )}
    </>
  );
}

