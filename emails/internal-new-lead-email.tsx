import * as React from 'react';
import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface InternalNewLeadEmailProps {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  message: string;
  source: string;
  pageUrl?: string | null;
  score: number;
  priority: string;
  createdAt: Date;
  siteUrl?: string;
  logoUrl?: string | null;
}

export const InternalNewLeadEmail = ({
  id,
  name,
  company,
  email,
  phone,
  message,
  source,
  pageUrl,
  score,
  priority,
  createdAt,
  siteUrl = "https://www.serviciosjess.cl",
  logoUrl,
}: InternalNewLeadEmailProps) => {
  const crmLink = `${siteUrl}/admin/owner/leads`;

  return (
    <EmailLayout
      previewText="Nuevo lead comercial recibido desde el sitio web"
      logoUrl={logoUrl}
      siteUrl={siteUrl}
    >
      <Section>
        <Text style={heading}>Nuevo Lead Recibido</Text>
        <Text style={text}>
          Se ha recibido un nuevo requerimiento a través del formulario web.
        </Text>

        <Section style={infoCard}>
          <div style={infoRow}>
            <Text style={label}>CLIENTE</Text>
            <Text style={value}>{name}</Text>
          </div>
          {company && (
            <div style={infoRow}>
              <Text style={label}>EMPRESA</Text>
              <Text style={value}>{company}</Text>
            </div>
          )}
          <div style={infoRow}>
            <Text style={label}>CONTACTO</Text>
            <Text style={value}>{email} {phone ? `| ${phone}` : ''}</Text>
          </div>
          <div style={infoRow}>
            <Text style={label}>FECHA</Text>
            <Text style={value}>{new Date(createdAt).toLocaleString('es-CL')}</Text>
          </div>
        </Section>

        <Section style={scoreCard}>
          <Text style={scoreText}>
            <strong>Score:</strong> {score} pts &nbsp;|&nbsp; <strong>Prioridad:</strong> {priority}
          </Text>
        </Section>

        <Section style={messageSection}>
          <Text style={label}>MENSAJE</Text>
          <div style={messageBox}>
            <Text style={messageContent}>{message}</Text>
          </div>
        </Section>

        <Section style={metaSection}>
          <Text style={metaText}>
            <strong>Origen:</strong> {source}
            {pageUrl && <><br /><strong>URL:</strong> {pageUrl}</>}
          </Text>
        </Section>

        <Section style={ctaContainer}>
          <Button
            href={crmLink}
            style={{ ...button, padding: '14px 28px' }}
          >
            ABRIR CRM
          </Button>
        </Section>
      </Section>
    </EmailLayout>
  );
};

export default InternalNewLeadEmail;

const heading = {
  color: '#111111',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const text = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 25px',
};

const infoCard = {
  backgroundColor: '#fbfaf7',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #e5e2dc',
  marginBottom: '20px',
};

const infoRow = {
  marginBottom: '15px',
};

const label = {
  color: '#888888',
  fontSize: '10px',
  fontWeight: 'bold',
  margin: '0 0 2px',
  letterSpacing: '0.05em',
};

const value = {
  color: '#1f2933',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const scoreCard = {
  backgroundColor: '#ffedd5',
  padding: '12px 15px',
  borderRadius: '8px',
  borderLeft: '4px solid #ea580c',
  marginBottom: '25px',
};

const scoreText = {
  color: '#ea580c',
  fontSize: '13px',
  margin: '0',
};

const messageSection = {
  marginBottom: '25px',
};

const messageBox = {
  backgroundColor: '#ffffff',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #e5e2dc',
};

const messageContent = {
  color: '#334155',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const metaSection = {
  marginBottom: '30px',
};

const metaText = {
  color: '#94a3b8',
  fontSize: '11px',
  lineHeight: '18px',
  margin: '0',
};

const ctaContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#111111',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center' as const,
};

