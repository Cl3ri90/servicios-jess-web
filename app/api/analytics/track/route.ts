import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, path, referrer, eventType, userAgent } = body;

    if (!sessionId || !path) {
      return NextResponse.json({ error: 'Missing sessionId or path' }, { status: 400 });
    }

    // Ignore admin and login paths
    if (path.startsWith('/admin') || path.startsWith('/login') || path.includes('favicon.ico') || path.includes('/api/')) {
      return NextResponse.json({ skipped: true });
    }

    // Basic bot detection
    const isBot = userAgent?.toLowerCase().includes('bot') || userAgent?.toLowerCase().includes('crawler') || userAgent?.toLowerCase().includes('spider');
    if (isBot) {
      return NextResponse.json({ skipped: true, reason: 'bot' });
    }

    // Save visit
    await prisma.siteVisit.create({
      data: {
        sessionId,
        path,
        referrer: referrer || null,
        userAgent: userAgent || null,
        eventType: eventType || 'page_view',
        // Optional: you could parse userAgent here for device/browser/os
        // but for now we keep it simple as requested
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
