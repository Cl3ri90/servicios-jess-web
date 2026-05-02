'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { validateAdminAccess } from '@/lib/admin/permissions'

// ============================================================
// Sticky CTA JSON Schema
// ============================================================
export interface StickyCTAConfig {
  isActive: boolean
  type: 'cotizar' | 'llamar' | 'whatsapp' | 'contacto' | 'personalizado'
  label: string
  href?: string
  icon?: 'phone' | 'message' | 'whatsapp' | 'arrow' | 'star'
  position: 'bottom-right' | 'bottom-left' | 'bottom-center'
  mobileOnly: boolean
  pages: 'all' | 'home' | 'servicios' | 'contacto'
}

const DEFAULT_CTA: StickyCTAConfig = {
  isActive: false,
  type: 'cotizar',
  label: 'Cotizar Ahora',
  position: 'bottom-right',
  mobileOnly: true,
  pages: 'all',
}

// ============================================================
// Read helpers
// ============================================================

export async function getStickyCta(): Promise<StickyCTAConfig> {
  const defaultBase = { ...DEFAULT_CTA }
  try {
    const record = await prisma.configMaster.findUnique({
      where: { tenantId_key: { tenantId: 'single', key: 'sticky_cta' } }
    })
    
    if (!record || !record.value) return defaultBase
    
    const parsed = JSON.parse(record.value)
    return { ...defaultBase, ...parsed }
  } catch (error) {
    console.warn('Failed to load Sticky CTA, using defaults')
    return defaultBase
  }
}

// Get WhatsApp number for type=whatsapp auto-link
export async function getWhatsAppNumber(): Promise<string | null> {
  try {
    const cfg = await prisma.whatsAppConfig.findUnique({
      where: { id: 'singleton' },
      select: { phoneNumber: true }
    })
    return cfg?.phoneNumber ?? null
  } catch (error) {
    return null
  }
}

// ============================================================
// Owner: Save CTA config
// ============================================================

export async function saveStickyCta(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const config: StickyCTAConfig = {
      isActive: formData.get('isActive') === 'true',
      type: (formData.get('type') as StickyCTAConfig['type']) || 'cotizar',
      label: (formData.get('label') as string) || 'Cotizar Ahora',
      href: (formData.get('href') as string) || undefined,
      icon: (formData.get('icon') as StickyCTAConfig['icon']) || undefined,
      position: (formData.get('position') as StickyCTAConfig['position']) || 'bottom-right',
      mobileOnly: formData.get('mobileOnly') !== 'false',
      pages: (formData.get('pages') as StickyCTAConfig['pages']) || 'all',
    }

    await prisma.configMaster.upsert({
      where: { tenantId_key: { tenantId: 'single', key: 'sticky_cta' } },
      update: { value: JSON.stringify(config) },
      create: { tenantId: 'single', key: 'sticky_cta', value: JSON.stringify(config) }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/admin/owner/cta')
    
    return { success: true, message: 'CTA flotante guardado.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Sin permisos o error guardando datos.' }
  }
}
