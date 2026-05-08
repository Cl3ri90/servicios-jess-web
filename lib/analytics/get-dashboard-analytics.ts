import { prisma } from '@/lib/db/prisma';

export async function getDashboardAnalytics() {
  const now = new Date();
  
  // Helpers para evitar dependencias externas
  const getStartOfDay = (d: Date) => {
    const res = new Date(d);
    res.setHours(0, 0, 0, 0);
    return res;
  };

  const getEndOfDay = (d: Date) => {
    const res = new Date(d);
    res.setHours(23, 59, 59, 999);
    return res;
  };

  const getSubDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setDate(res.getDate() - days);
    return res;
  };

  const todayStart = getStartOfDay(now);
  const todayEnd = getEndOfDay(now);
  const sevenDaysAgo = getSubDays(todayStart, 7);

  // 1. Visitas hoy (totales y únicas)
  const todayVisits = await prisma.siteVisit.count({
    where: { createdAt: { gte: todayStart, lte: todayEnd } }
  });

  const todayUniqueVisitorsResult = await prisma.siteVisit.groupBy({
    by: ['sessionId'],
    where: { createdAt: { gte: todayStart, lte: todayEnd } },
  });
  const todayUniqueVisitors = todayUniqueVisitorsResult.length;

  // 2. Visitas últimos 7 días
  const last7DaysVisits = await prisma.siteVisit.count({
    where: { createdAt: { gte: sevenDaysAgo } }
  });

  // 3. Top páginas
  const topPages = await prisma.siteVisit.groupBy({
    by: ['path'],
    _count: { path: true },
    orderBy: { _count: { path: 'desc' } },
    take: 5
  });

  // 4. Eventos recientes
  const recentEvents = await prisma.siteEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // 5. Clicks en CTA (conteo total de eventos tipo click)
  const ctaClicks = await prisma.siteEvent.count({
    where: { type: { in: ['cta_click', 'floating_cta_click', 'main_cta_click'] } }
  });

  // 6. Leads captados (de la tabla Lead existente)
  const leadCount = await prisma.lead.count();

  // 7. Tasa de conversión (leads / visitantes únicos totales)
  const totalUniqueVisitorsResult = await prisma.siteVisit.groupBy({
    by: ['sessionId'],
  });
  const totalUniqueVisitors = totalUniqueVisitorsResult.length;
  const conversionRate = totalUniqueVisitors > 0 ? (leadCount / totalUniqueVisitors) : 0;

  // 8. Página más visitada y CTA más clickeado
  const mostVisitedPage = topPages[0]?.path || 'N/A';
  
  const topCta = await prisma.siteEvent.groupBy({
    by: ['label'],
    where: { type: { in: ['cta_click', 'floating_cta_click', 'main_cta_click'] } },
    _count: { label: true },
    orderBy: { _count: { label: 'desc' } },
    take: 1
  });
  const mostClickedCta = topCta[0]?.label || 'N/A';

  // 9. Bounce Rate Básico (últimos 30 días para tener muestra significativa)
  const thirtyDaysAgo = getSubDays(todayStart, 30);
  const sessions = await prisma.siteVisit.groupBy({
    by: ['sessionId'],
    where: { createdAt: { gte: thirtyDaysAgo } },
    _count: { sessionId: true }
  });

  const totalSessions = sessions.length;
  const bouncedSessionsCount = sessions.filter(s => s._count.sessionId === 1).length;
  const engagedSessionsCount = totalSessions - bouncedSessionsCount;
  const bounceRate = totalSessions > 0 ? (bouncedSessionsCount / totalSessions) : 0;

  // 10. Datos para gráfico (últimos 7 días)
  const dailyVisits = [];
  for (let i = 6; i >= 0; i--) {
    const day = getSubDays(todayStart, i);
    const count = await prisma.siteVisit.count({
      where: { 
        createdAt: { 
          gte: getStartOfDay(day), 
          lte: getEndOfDay(day) 
        } 
      }
    });
    dailyVisits.push({
      date: day.toLocaleDateString('es-CL', { weekday: 'short' }),
      visits: count
    });
  }

  return {
    todayVisits,
    todayUniqueVisitors,
    last7DaysVisits,
    topPages: topPages.map(p => ({ path: p.path, count: p._count.path })),
    recentEvents,
    ctaClicks,
    leadCount,
    conversionRate,
    mostVisitedPage,
    mostClickedCta,
    bounceRate,
    bouncedSessions: bouncedSessionsCount,
    engagedSessions: engagedSessionsCount,
    totalSessions,
    dailyVisits
  };
}
