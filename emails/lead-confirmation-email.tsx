import * as React from 'react';
import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { cleanEmailBodyGreeting } from '@/lib/email/templates/utils';

interface LeadConfirmationEmailProps {
  name: string;
  company?: string | null;
  message: string;
  siteUrl?: string;
  logoUrl?: string | null;
}

export const LeadConfirmationEmail = ({
  name,
  company,
  message,
  siteUrl = "https://www.serviciosjess.cl",
  logoUrl,
}: LeadConfirmationEmailProps) => {
  const cleanedMessage = cleanEmailBodyGreeting(message, name);

  return (
    <EmailLayout 
      previewText="Confirmación de requerimiento técnico - Servicios Jess SpA"
      logoUrl={logoUrl}
      siteUrl={siteUrl}
    >
      <Section>
        <Text style={greeting}>Hola <span style={highlight}>{name}</span>,</Text>
        
        <Text style={text}>
          Hemos recibido tu solicitud correctamente. Nuestro equipo técnico revisará tu mensaje y se pondrá en contacto contigo a la brevedad.
        </Text>

        <Section style={summaryCard}>
          <Text style={summaryHeading}>RESUMEN DE TU SOLICITUD</Text>
          <div style={summaryRow}>
            <Text style={summaryLabel}>Empresa:</Text>
            <Text style={summaryValue}>{company || "No informada"}</Text>
          </div>
          <div style={summaryRow}>
            <Text style={summaryLabel}>Tipo:</Text>
            <Text style={summaryValue}>Requerimiento Técnico</Text>
          </div>
          <div style={summaryRow}>
            <Text style={summaryLabel}>Estado:</Text>
            <Text style={summaryValue}>
              <span style={badge}>En Revisión</span>
            </Text>
          </div>
          <div style={summaryBox}>
            <Text style={summaryLabel}>Mensaje:</Text>
            <Text style={messageText}>{cleanedMessage}</Text>
          </div>
        </Section>

        <Section style={ctaContainer}>
          <Button
            href={siteUrl}
            style={{ ...button, padding: '16px 32px' }}
          >
            VISITAR SITIO WEB
          </Button>
        </Section>
      </Section>
    </EmailLayout>
  );
};

export default LeadConfirmationEmail;

const greeting = {
  color: '#1f2933',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px',
};

const highlight = {
  color: '#ea580c',
};

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 30px',
};

const summaryCard = {
  backgroundColor: '#fbfaf7',
  padding: '30px',
  borderRadius: '16px',
  border: '1px solid #e5e2dc',
  marginBottom: '35px',
};

const summaryHeading = {
  color: '#111111',
  fontSize: '12px',
  fontWeight: '900',
  letterSpacing: '0.1em',
  margin: '0 0 20px',
};

const summaryRow = {
  marginBottom: '12px',
};

const summaryLabel = {
  color: '#888888',
  fontSize: '11px',
  fontWeight: 'bold',
  margin: '0 0 2px',
  textTransform: 'uppercase' as const,
};

const summaryValue = {
  color: '#1f2933',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const summaryBox = {
  marginTop: '20px',
  paddingTop: '20px',
  borderTop: '1px solid #e5e2dc',
};

const messageText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  fontStyle: 'italic',
};

const badge = {
  backgroundColor: '#ffedd5',
  color: '#ea580c',
  padding: '2px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 'bold',
};

const ctaContainer = {
  textAlign: 'center' as const,
  marginTop: '10px',
};

const button = {
  backgroundColor: '#ea580c',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center' as const,
};
