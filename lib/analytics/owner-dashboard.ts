import { prisma } from '@/lib/prisma';

export type DashboardRange = 'today' | '7d' | '30d' | 'all';

export async function getOwnerDashboardData(range: DashboardRange = '30d') {
  const now = new Date();
  let startDate: Date | undefined;

  if (range === 'today') {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
  } else if (range === '7d') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
  } else if (range === '30d') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
  }

  const whereDate = startDate ? { gte: startDate } : {};

  // 1. Visitas del sitio
  const visitsCount = await prisma.siteVisit.count({
    where: { createdAt: whereDate }
  });

  // 2. Leads por estado en el rango
  const leads = await prisma.lead.findMany({
    where: { createdAt: whereDate },
    include: {
      activities: {
        orderBy: { createdAt: 'asc' },
        take: 1
      },
      emails: {
        where: {
          direction: 'OUTBOUND',
          status: 'SENT',
          NOT: {
            subject: { contains: 'Recibimos tu solicitud' }
          }
        },
        orderBy: { createdAt: 'asc' },
        take: 1
      }
    }
  });

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'NEW' || l.status === 'OPEN').length;
  const contactedLeads = leads.filter(l => ['IN_PROGRESS', 'ATTEMPTED_CONTACT', 'CONTACTED', 'QUALIFIED', 'QUOTED'].includes(l.status)).length;
  const wonLeads = leads.filter(l => l.status === 'WON').length;
  const lostLeads = leads.filter(l => l.status === 'LOST').length;

  // 3. Tasas
  const closureRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
  const lossRate = totalLeads > 0 ? (lostLeads / totalLeads) * 100 : 0;

  // 4. Tiempo promedio de respuesta
  let totalResponseTime = 0;
  let respondedLeadsCount = 0;
  let pendingResponseCount = 0;

  leads.forEach(lead => {
    const firstManualEmail = lead.emails[0];
    // También podríamos considerar actividades de contacto manual
    // Pero el correo es el indicador más claro de respuesta al cliente.
    
    if (firstManualEmail) {
      const diff = firstManualEmail.createdAt.getTime() - lead.createdAt.getTime();
      totalResponseTime += diff;
      respondedLeadsCount++;
    } else if (lead.status !== 'WON' && lead.status !== 'LOST' && lead.status !== 'ARCHIVED') {
      pendingResponseCount++;
    }
  });

  const avgResponseTimeMs = respondedLeadsCount > 0 ? totalResponseTime / respondedLeadsCount : 0;

  // 5. Actividad reciente (últimos 10 eventos)
  const [recentActivities, recentEmails] = await Promise.all([
    prisma.leadActivity.findMany({
      where: { createdAt: whereDate },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { lead: { select: { name: true } } }
    }),
    prisma.leadEmail.findMany({
      where: { createdAt: whereDate },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { lead: { select: { name: true } } }
    })
  ]);

  // Combinar y ordenar actividad
  const combinedActivity = [
    ...recentActivities.map(a => ({
      id: `act-${a.id}`,
      type: 'ACTIVITY',
      title: a.title,
      subtitle: a.lead?.name || 'Cliente desconocido',
      date: a.createdAt,
      iconType: a.type
    })),
    ...recentEmails.map(e => ({
      id: `eml-${e.id}`,
      type: 'EMAIL',
      title: e.direction === 'INBOUND' ? 'Respuesta recibida' : 'Correo enviado',
      subtitle: `${e.lead?.name || 'Cliente'} - ${e.subject}`,
      date: e.createdAt,
      iconType: e.direction
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

  return {
    metrics: {
      visits: visitsCount,
      totalLeads,
      new: newLeads,
      contacted: contactedLeads,
      resolved: wonLeads,
      lost: lostLeads,
      closureRate,
      lossRate,
      avgResponseTimeMs,
      pendingResponseCount
    },
    activity: combinedActivity
  };
}
