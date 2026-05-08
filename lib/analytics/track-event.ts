'use client';

type EventParams = {
  type: 'cta_click' | 'floating_cta_click' | 'main_cta_click' | 'contact_form_submit' | 'whatsapp_click' | 'service_card_view' | 'portfolio_view' | string;
  label?: string;
  path?: string;
  metadata?: Record<string, any>;
};

// Map to handle debouncing in memory
const lastEvents: Record<string, number> = {};

export async function trackEvent({ type, label, path, metadata }: EventParams) {
  if (typeof window === 'undefined') return;

  const currentPath = path || window.location.pathname + window.location.search;
  const eventKey = `${type}:${label || ''}:${currentPath}`;
  const now = Date.now();

  // Debounce: 1 second per unique event (type+label+path)
  if (lastEvents[eventKey] && now - lastEvents[eventKey] < 1000) {
    return;
  }
  lastEvents[eventKey] = now;

  const sessionId = sessionStorage.getItem('site_session_id');

  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        type,
        label,
        path: currentPath,
        metadata,
      }),
      keepalive: true,
    });
  } catch (err) {
    // Fail silently
  }
}
