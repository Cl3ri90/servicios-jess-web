import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, type, label, path, metadata } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }

    // Ignore admin events if any
    if (path?.startsWith('/admin')) {
      return NextResponse.json({ skipped: true });
    }

    await prisma.siteEvent.create({
      data: {
        sessionId: sessionId || null,
        type,
        label: label || null,
        path: path || null,
        metadata: metadata || {},
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
