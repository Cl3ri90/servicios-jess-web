import { getCurrentProfile } from '@/lib/db/profile'
import { redirect } from 'next/navigation'
import MetricasView from '@/components/admin/views/MetricasView'
import { prisma } from '@/lib/db/prisma'

export default async function AdminMetricasPage(props: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const searchParams = await props.searchParams;
  const profile = await getCurrentProfile()
  if (!profile?.tenantId) redirect('/unauthorized')

  // @ts-ignore
  const metricas = await prisma.metric.findMany({
    where: { tenantId: profile.tenantId },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  const activeMetric = searchParams.edit 
    ? metricas.find((m: any) => m.id === searchParams.edit)
    : undefined;

  return <MetricasView 
    tenantId={profile.tenantId} 
    initialMetrics={metricas}
    activeMetric={activeMetric}
  />
}
