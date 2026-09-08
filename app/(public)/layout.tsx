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
  const { config, seo } = await getSiteConfig();

  // Lógica de Prioridad para Título
  const title =
    seo?.pages?.inicio?.title ||
    config?.metaTitle ||
    seo?.global?.siteTitle ||
    'Servicios Jess | Gomas industriales, plásticos de ingeniería y maestranza';

  // Lógica de Prioridad para Descripción
  const description =
    seo?.pages?.inicio?.description ||
    config?.metaDescription ||
    seo?.global?.description ||
    'Expertos en gomas industriales, plásticos de ingeniería y maestranza. Fabricamos soluciones técnicas a medida para empresas e industrias.';

  // Título compacto para Redes Sociales (OG / Twitter)
  const socialTitle = seo?.pages?.inicio?.ogTitle || (title.length > 60 ? 'Servicios Jess | Soluciones Industriales' : title);

  return {
    metadataBase: new URL('https://www.serviciosjess.cl'),
    title: {
      template: `%s | ${config?.name || 'Servicios Jess'}`,
      default: title,
    },
    description: description,
    openGraph: {
      title: socialTitle,
      description: description,
      url: 'https://www.serviciosjess.cl',
      siteName: config?.name || 'Servicios Jess',
      type: 'website',
      images: config?.logoUrl ? [{ url: config.logoUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: description,
      images: config?.logoUrl ? [config.logoUrl] : [],
    },
    icons: {
      icon: config?.faviconUrl || '/favicon.ico',
      shortcut: config?.faviconUrl || '/favicon.ico',
      apple: config?.faviconUrl || '/apple-touch-icon.png',
    },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { config, seo, activeFlags } = await getSiteConfig();

  const description =
    seo?.pages?.inicio?.description ||
    config?.metaDescription ||
    seo?.global?.description ||
    'Expertos en gomas industriales, plásticos de ingeniería y maestranza. Fabricamos soluciones técnicas a medida para empresas e industrias.';

  const mainCtaConfig = await getMainCtaConfig();

  const showPopup = activeFlags.includes('popup_promocional');
  const popup = showPopup ? await getActivePopup() : null;

  const now = new Date();

  const validPopup = popup && popup.isActive && popup.title?.trim() !== '' &&
    (!popup.startsAt || new Date(popup.startsAt) <= now) &&
    (!popup.endsAt || new Date(popup.endsAt) >= now);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": config?.name || "Servicios Jess SpA",
    "url": "https://www.serviciosjess.cl",
    "logo": config?.logoUrl || "",
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config?.contactAddress || "Calle 5 de abril N 357 Arenas del Bío Bío",
      "addressLocality": "Concepción",
      "addressCountry": "CL"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": config?.contactPhone || "",
      "contactType": "customer service",
      "email": config?.contactEmail || "serviciosjess@gmail.com"
    }
  };

  const isValidHex = (hex?: string | null): hex is string => {
    if (!hex) return false;
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
  };

  const primaryColor = isValidHex(config?.primaryColor) ? config.primaryColor.trim() : '#EA580C';
  const customBg = isValidHex(config?.secondaryColor) ? config.secondaryColor.trim() : undefined;

  const dynamicStyles: Record<string, string> = {
    '--site-primary': primaryColor,
    '--site-primary-hover': primaryColor,
    '--site-accent-soft': `${primaryColor}1A`,
  };

  if (customBg) {
    dynamicStyles['--site-custom-bg'] = customBg;
  }

  const antiFoucScript = `(function(){try{var t=localStorage.getItem('servicios-jess-theme');if(t==='dark'||t==='light'){var el=document.querySelector('.public-site');if(el){el.setAttribute('data-theme',t);}}}catch(e){}})();`;

  return (
    <div
      className="public-site"
      data-theme="light"
      suppressHydrationWarning
      style={dynamicStyles as React.CSSProperties}
    >
      <script dangerouslySetInnerHTML={{ __html: antiFoucScript }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </div>
  );
}

