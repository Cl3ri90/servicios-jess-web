import * as React from 'react';
import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { cleanEmailBodyGreeting } from '@/lib/email/templates/utils';

interface LeadReplyEmailProps {
  name: string;
  message: string;
  siteUrl?: string;
  logoUrl?: string | null;
}

export const LeadReplyEmail = ({
  name,
  message,
  siteUrl = "https://www.serviciosjess.cl",
  logoUrl,
}: LeadReplyEmailProps) => {
  const cleanedMessage = cleanEmailBodyGreeting(message, name);

  // Convert line breaks to React elements safely
  const formattedMessage = cleanedMessage.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <EmailLayout 
      previewText="Respuesta de Servicios Jess a tu solicitud"
      logoUrl={logoUrl}
      siteUrl={siteUrl}
    >
      <Section>
        <Text style={greeting}>Hola <span style={highlight}>{name}</span>,</Text>
        
        <Section style={messageContainer}>
          <Text style={text}>
            {formattedMessage}
          </Text>
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

export default LeadReplyEmail;

const greeting = {
  color: '#1f2933',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 25px',
};

const highlight = {
  color: '#ea580c',
};

const messageContainer = {
  backgroundColor: '#fbfaf7',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid #e5e2dc',
  marginBottom: '30px',
};

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
};

const ctaContainer = {
  textAlign: 'center' as const,
  marginTop: '20px',
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
