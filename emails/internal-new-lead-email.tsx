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
  Link,
} from '@react-email/components';

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
}

const BRAND = {
  orange: "#ea580c",
  background: "#f4f4f5", // Light background for internal emails
  text: "#18181b",
  muted: "#52525b",
  containerBg: "#ffffff",
};

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
}: InternalNewLeadEmailProps) => {
  const siteUrl = process.env.SITE_URL || 'https://servicios-jess-web.vercel.app';
  const crmLink = `${siteUrl}/admin/owner/leads`;

  return (
    <Html>
      <Head />
      <Preview>Nuevo lead comercial desde la web</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nuevo Lead Recibido</Heading>
          
          <Section style={section}>
            <Text style={text}>
              Se ha recibido un nuevo requerimiento a través del formulario web.
            </Text>
          </Section>

          <Section style={infoCard}>
            <Text style={infoRow}>
              <strong>Nombre:</strong> {name}
            </Text>
            {company && (
              <Text style={infoRow}>
                <strong>Empresa:</strong> {company}
              </Text>
            )}
            <Text style={infoRow}>
              <strong>Email:</strong> {email}
            </Text>
            {phone && (
              <Text style={infoRow}>
                <strong>Teléfono:</strong> {phone}
              </Text>
            )}
            <Text style={infoRow}>
              <strong>Fecha:</strong> {new Date(createdAt).toLocaleString('es-CL')}
            </Text>
          </Section>

          <Section style={scoreCard}>
            <Text style={scoreText}>
              <strong>Score:</strong> {score} pts &nbsp;|&nbsp; <strong>Prioridad:</strong> {priority}
            </Text>
          </Section>

          <Section style={section}>
            <Text style={subheading}>Mensaje del cliente:</Text>
            <Text style={messageBox}>
              {message}
            </Text>
          </Section>

          <Section style={section}>
            <Text style={infoRowMuted}>
              <strong>Origen:</strong> {source}
              {pageUrl && <><br /><strong>URL:</strong> {pageUrl}</>}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={buttonContainer}>
            <Link href={crmLink} style={button}>
              Ver en el CRM
            </Link>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default InternalNewLeadEmail;

const main = {
  backgroundColor: BRAND.background,
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: BRAND.containerBg,
  margin: '0 auto',
  padding: '40px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  maxWidth: '600px',
};

const h1 = {
  color: BRAND.text,
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '0 0 20px',
};

const subheading = {
  color: BRAND.text,
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const section = {
  margin: '0 0 20px',
};

const text = {
  color: BRAND.text,
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 15px',
};

const infoCard = {
  backgroundColor: '#f4f4f5', // zinc-100
  padding: '15px',
  borderRadius: '6px',
  margin: '0 0 15px',
};

const infoRow = {
  color: BRAND.text,
  fontSize: '14px',
  margin: '0 0 8px',
};

const infoRowMuted = {
  color: BRAND.muted,
  fontSize: '12px',
  margin: '0',
  lineHeight: '18px',
};

const scoreCard = {
  backgroundColor: '#ffedd5', // orange-100
  padding: '12px 15px',
  borderRadius: '6px',
  borderLeft: `4px solid ${BRAND.orange}`,
  margin: '0 0 20px',
};

const scoreText = {
  color: BRAND.orange,
  fontSize: '14px',
  margin: '0',
};

const messageBox = {
  backgroundColor: '#f4f4f5', // zinc-100
  color: BRAND.text,
  fontSize: '14px',
  lineHeight: '22px',
  padding: '15px',
  borderRadius: '6px',
  margin: '0',
  border: '1px solid #e4e4e7', // zinc-200
};

const hr = {
  borderColor: '#e4e4e7', // zinc-200
  margin: '30px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: BRAND.orange,
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
};
