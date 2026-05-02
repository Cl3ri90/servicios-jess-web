import { prisma } from '@/lib/db/prisma'
import { AlertTriangle, Lock, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'

export default async function PlanLimitBanner({ tenantId }: { tenantId: string }) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { subscriptionTier: true }
  }) as { subscriptionTier: string } | null
  
  if (!tenant) return null

  const activeCount = await prisma.practitioner.count({
    where: { tenantId, isActive: true }
  })

  const limitMapping: Record<string, number> = {
    'BASIC': 10,
    'PRO': 50,
    'PREMIUM': 999999
  }
  
  const limit = limitMapping[tenant.subscriptionTier] || 10
  const isCapped = activeCount >= limit
  const isWarning = activeCount >= limit - 2 && !isCapped

  // PREMIUM usually has no real limit in visual UI
  if (tenant.subscriptionTier === 'PREMIUM') return null

  return (
    <>
      {isCapped && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3">
             <div className="bg-red-500/20 p-2 rounded-full h-fit flex-shrink-0">
               <Lock className="w-6 h-6 text-red-500" />
             </div>
             <div>
                <h4 className="text-red-400 font-bold text-lg">Capacidad Máxima Alcanzada</h4>
                <p className="text-red-200/80 text-sm mt-1">
                   Tu plan <strong>{tenant.subscriptionTier}</strong> permite hasta {limit} profesionales activos (Actual: {activeCount}). Ya no puedes registrar más profesionales.
                </p>
             </div>
          </div>
          <Link href="/admin/owner/billing" className="whitespace-nowrap flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-900/20">
             <ArrowUpCircle className="w-5 h-5"/>
             {tenant.subscriptionTier === 'BASIC' ? 'Mejora a PRO para añadir más equipo' : 'Mejora a PREMIUM'}
          </Link>
        </div>
      )}

      {isWarning && (
        <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-5 mb-8 flex items-center gap-4">
           <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0" />
           <div>
              <p className="text-orange-300 font-semibold">Te estás acercando al límite de tu plan {tenant.subscriptionTier}</p>
              <p className="text-orange-200/70 text-sm mt-0.5">Tienes {activeCount} profesionales activos de un máximo de {limit}. Mejora tu plan pronto para evitar interrupciones en tu crecimiento.</p>
           </div>
        </div>
      )}
    </>
  )
}
