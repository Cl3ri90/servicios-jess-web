import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface LeadConfirmationEmailProps {
  name: string;
  company?: string | null;
  message: string;
}

const BRAND = {
  orange: "#ea580c",
  background: "#0a0a0a",
  text: "#f5f5f5",
  muted: "#a1a1aa",
};

export const LeadConfirmationEmail = ({
  name,
  company,
  message,
}: LeadConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Recibimos tu solicitud | Servicios Jess</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Servicios Jess</Heading>
          
          <Section style={section}>
            <Text style={text}>Hola {name},</Text>
            <Text style={text}>
              Gracias por contactar a <strong>Servicios Jess</strong>. Hemos recibido tu requerimiento técnico.
            </Text>
            <Text style={text}>
              Nuestro equipo comercial y técnico revisará la información que nos enviaste y se pondrá en contacto contigo a la brevedad.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={subheading}>Resumen de tu solicitud:</Text>
            <Text style={textMuted}>
              <strong>Nombre:</strong> {name}
              {company && <><br /><strong>Empresa:</strong> {company}</>}
            </Text>
            <Text style={textMuted}>
              <strong>Requerimiento:</strong>
              <br />
              {message}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>Servicios Jess</Text>
            <Text style={footerTextMuted}>
              Fabricantes de gomas industriales, plásticos de ingeniería y maestranza.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default LeadConfirmationEmail;

const main = {
  backgroundColor: BRAND.background,
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const h1 = {
  color: BRAND.orange,
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '0 0 30px',
};

const subheading = {
  color: BRAND.text,
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const section = {
  padding: '0',
  margin: '0 0 20px',
};

const text = {
  color: BRAND.text,
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 15px',
};

const textMuted = {
  color: BRAND.muted,
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 15px',
};

const hr = {
  borderColor: '#27272a', // zinc-800
  margin: '30px 0',
};

const footer = {
  margin: '0',
};

const footerText = {
  color: BRAND.text,
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 5px',
};

const footerTextMuted = {
  color: BRAND.muted,
  fontSize: '12px',
  margin: '0',
};
