'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<Record<string, number>>({});

  useEffect(() => {
    // Generate or get sessionId
    let sessionId = sessionStorage.getItem('site_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('site_session_id', sessionId);
    }

    const trackPageView = async () => {
      const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      
      // Debounce: 1 second per path
      const now = Date.now();
      if (lastTracked.current[fullPath] && now - lastTracked.current[fullPath] < 1000) {
        return;
      }
      lastTracked.current[fullPath] = now;

      // Skip admin and login
      if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
        return;
      }

      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            path: fullPath,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            eventType: 'page_view',
          }),
          // Using keepalive ensures the request finishes even if user navigates away
          keepalive: true,
        });
      } catch (err) {
        // Silently fail to not affect user experience
      }
    };

    trackPageView();
  }, [pathname, searchParams]);

  return null; // Invisible component
}
