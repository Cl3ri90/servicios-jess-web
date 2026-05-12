import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Heading,
} from '@react-email/components';

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
  logoUrl?: string | null;
  siteUrl?: string;
}

export const EmailLayout = ({
  previewText,
  children,
  logoUrl,
  siteUrl = "https://www.serviciosjess.cl",
}: EmailLayoutProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Industrial */}
          <Section style={header}>
            <div style={headerContent}>
              {logoUrl ? (
                <Img
                  src={logoUrl}
                  width="180"
                  height="auto"
                  alt="Servicios Jess"
                  style={logo}
                />
              ) : (
                <Heading style={wordmark}>SERVICIOS JESS</Heading>
              )}
              <Text style={tagline}>Fabricando soluciones industriales</Text>
            </div>
            <div style={orangeLine} />
          </Section>

          {/* Card Principal */}
          <Section style={card}>
            {children}
          </Section>

          {/* Footer Profesional */}
          <Section style={footer}>
            <Section style={footerNotice}>
              <Text style={footerNoticeText}>
                Este mensaje corresponde a una comunicación oficial de Servicios Jess SpA. 
                Si has recibido este correo por error, por favor notifícanos.
              </Text>
            </Section>
            
            <Section style={footerBrand}>
              <Text style={footerBrandName}>SERVICIOS JESS SpA</Text>
              <Text style={footerInfo}>
                Expertos en gomas industriales, plásticos de ingeniería y maestranza.
              </Text>
              
              <div style={footerLinks}>
                <Link href={`${siteUrl}/contacto`} style={footerLink}>Contacto</Link>
                <span style={footerSeparator}>&nbsp;•&nbsp;</span>
                <Link href={siteUrl} style={footerLink}>Sitio Web</Link>
              </div>
              
              <Text style={copyright}>
                © {currentYear} Servicios Jess. Todos los derechos reservados.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailLayout;

// Estilos Premium Industriales
const main = {
  backgroundColor: '#f4f4f2',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 10px',
  maxWidth: '640px',
};

const header = {
  backgroundColor: '#111111',
  borderRadius: '18px 18px 0 0',
  overflow: 'hidden',
  textAlign: 'center' as const,
};

const headerContent = {
  padding: '40px 20px 30px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const wordmark = {
  color: '#ea580c',
  fontSize: '28px',
  fontWeight: '900',
  letterSpacing: '0.1em',
  margin: '0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

const tagline = {
  color: '#888888',
  fontSize: '12px',
  fontWeight: '500',
  letterSpacing: '0.2em',
  margin: '10px 0 0',
  textTransform: 'uppercase' as const,
};

const orangeLine = {
  backgroundColor: '#ea580c',
  height: '4px',
  width: '100%',
};

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 18px 18px',
  padding: '40px',
  border: '1px solid #e5e2dc',
  borderTop: '0',
};

const footer = {
  marginTop: '30px',
  textAlign: 'center' as const,
};

const footerNotice = {
  backgroundColor: '#e5e2dc',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px',
};

const footerNoticeText = {
  color: '#52525b',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
};

const footerBrand = {
  padding: '0 20px',
};

const footerBrandName = {
  color: '#111111',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 5px',
};

const footerInfo = {
  color: '#71717a',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 15px',
};

const footerLinks = {
  marginBottom: '15px',
};

const footerLink = {
  color: '#ea580c',
  fontSize: '12px',
  fontWeight: '600',
  textDecoration: 'none',
};

const footerSeparator = {
  color: '#d4d4d8',
};

const copyright = {
  color: '#a1a1aa',
  fontSize: '11px',
  margin: '0',
};
