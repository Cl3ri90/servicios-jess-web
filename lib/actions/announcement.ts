'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { validateAdminAccess } from '@/lib/admin/permissions'

// ============================================================
// Announcement Bar JSON Schema
// ============================================================
export interface AnnouncementBarConfig {
  isActive: boolean
  text: string
  ctaText?: string
  ctaUrl?: string
  bgColor: string
  textColor: string
  dismissible: boolean
  pages: 'all' | 'home' | 'contacto' | 'servicios'
  startsAt?: string | null
  endsAt?: string | null
}

const DEFAULT_BAR: AnnouncementBarConfig = {
  isActive: false,
  text: '',
  bgColor: '#ea580c',
  textColor: '#ffffff',
  dismissible: true,
  pages: 'all',
}

// ============================================================
// Read helpers
// ============================================================

export async function getAnnouncementBar(): Promise<AnnouncementBarConfig> {
  const defaultBase = { ...DEFAULT_BAR }
  try {
    const record = await prisma.configMaster.findUnique({
      where: { tenantId_key: { tenantId: 'single', key: 'announcement_bar' } }
    })
    
    if (!record || !record.value) return defaultBase
    
    const parsed = JSON.parse(record.value)
    return { ...defaultBase, ...parsed }
  } catch (error) {
    console.warn('Failed to load announcement bar, using defaults')
    return defaultBase
  }
}

// ============================================================
// Owner: Save announcement bar config
// ============================================================

export async function saveAnnouncementBar(formData: FormData) {
  try {
    await validateAdminAccess("OWNER");

    const config: AnnouncementBarConfig = {
      isActive: formData.get('isActive') === 'true',
      text: (formData.get('text') as string) || '',
      ctaText: (formData.get('ctaText') as string) || undefined,
      ctaUrl: (formData.get('ctaUrl') as string) || undefined,
      bgColor: (formData.get('bgColor') as string) || '#ea580c',
      textColor: (formData.get('textColor') as string) || '#ffffff',
      dismissible: formData.get('dismissible') !== 'false',
      pages: (formData.get('pages') as AnnouncementBarConfig['pages']) || 'all',
      startsAt: (formData.get('startsAt') as string) || null,
      endsAt: (formData.get('endsAt') as string) || null,
    }

    await prisma.configMaster.upsert({
      where: { tenantId_key: { tenantId: 'single', key: 'announcement_bar' } },
      update: { value: JSON.stringify(config) },
      create: { tenantId: 'single', key: 'announcement_bar', value: JSON.stringify(config) }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/admin/owner/anuncio')
    
    return { success: true, message: 'Barra de anuncio guardada.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Sin permisos o error guardando datos.' }
  }
}
