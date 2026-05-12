# Configuración de Resend Inbound CRM

Este documento detalla la configuración necesaria para que el CRM capture las respuestas de los clientes a través de Resend.

## Webhook en Resend

Para capturar los eventos de correo, debes configurar un Webhook en tu panel de Resend con los siguientes detalles:

- **Endpoint URL**: `https://serviciosjess.cl/api/webhooks/resend`
- **Eventos**:
  - `email.received` (Captura respuestas de clientes)
  - `email.delivered` (Actualiza estado de entrega)
  - `email.opened` (Actualiza estado de apertura)
  - `email.bounced` (Actualiza estado de rebote)

> [!IMPORTANT]
> Si en el futuro se activa `trailingSlash: true` en `next.config.ts`, la URL en Resend **deberá** cambiarse a:
> `https://serviciosjess.cl/api/webhooks/resend/` (con slash final) para evitar errores 307.

## Variables de Entorno Requeridas

- `RESEND_WEBHOOK_SECRET`: El secreto de firma de Svix proporcionado por Resend.
- `RESEND_RECEIVING_DOMAIN`: El dominio configurado en Resend para recibir correos (ej: `inbound.serviciosjess.cl`).

## Lógica de Asociación (Matching)

El sistema intenta asociar los correos entrantes con un Lead en el siguiente orden de prioridad:

1. **Código en el Asunto**: Busca el patrón `[SJ-XXXXXX]` en el asunto del correo.
2. **Código en el Destinatario**: Busca el patrón en la dirección `To` (ej: `lead-sj-a1b2c3@...`).
3. **Email del Remitente**: Si no hay código, busca leads que tengan el mismo email de origen (solo si no hay ambigüedad).

## Seguridad e Idempotencia

- **Verificación de Firma**: Se utiliza Svix para asegurar que las peticiones provienen de Resend.
- **Deduplicación**: El sistema utiliza el `message_id` de Resend para evitar procesar el mismo correo dos veces.
- **Sanitización**: Todo el HTML entrante es procesado con `isomorphic-dompurify` para eliminar contenido malicioso.
