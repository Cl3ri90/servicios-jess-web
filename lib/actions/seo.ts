'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { validateAdminAccess } from '@/lib/admin/permissions'

// ============================================================
// SEO Config JSON Schema
// ============================================================
export interface SeoPageConfig {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  noindex?: boolean
  canonical?: string
}

export interface SeoConfig {
  global: {
    siteTitle?: string
    description?: string
    keywords?: string
    ogImage?: string
    noindex?: boolean
    canonicalBase?: string
  }
  pages: {
    inicio?: SeoPageConfig
    servicios?: SeoPageConfig
    empresa?: SeoPageConfig
    portafolio?: SeoPageConfig
    contacto?: SeoPageConfig
  }
  schema: {
    orgName?: string
    orgUrl?: string
    orgLogo?: string
    address?: string
    phone?: string
    email?: string
    socialLinks?: string[]
  }
}

const DEFAULT_SEO: SeoConfig = {
  global: {},
  pages: {},
  schema: {}
}

// ============================================================
// Helpers
// ============================================================

export async function getSeoConfig(): Promise<SeoConfig> {
  const defaultBase: SeoConfig = {
    global: { ...DEFAULT_SEO.global },
    pages: { ...DEFAULT_SEO.pages },
    schema: { ...DEFAULT_SEO.schema }
  }

  try {
    const record = await prisma.configMaster.findUnique({
      where: { tenantId_key: { tenantId: 'single', key: 'seo_config' } }
    })
    
    if (!record || !record.value) return defaultBase
    
    const parsed = JSON.parse(record.value)
    
    return {
      global: { ...defaultBase.global, ...parsed?.global },
      pages: { ...defaultBase.pages, ...parsed?.pages },
      schema: { ...defaultBase.schema, ...parsed?.schema }
    }
  } catch (error) {
    console.warn('Failed to load SEO config, using defaults')
    return defaultBase
  }
}

// ============================================================
// Owner: Save SEO config
// ============================================================

export async function saveSeoConfig(prevState: any, formData: FormData) {
  try {
    const session = await validateAdminAccess("DEVELOPER");

    const currentConfig = await getSeoConfig()

    const newConfig: SeoConfig = {
      global: {
        siteTitle: (formData.get('global_siteTitle') as string) || currentConfig.global.siteTitle,
        description: (formData.get('global_description') as string) || currentConfig.global.description,
        keywords: (formData.get('global_keywords') as string) || currentConfig.global.keywords,
        ogImage: (formData.get('global_ogImage') as string) || currentConfig.global.ogImage,
        noindex: formData.get('global_noindex') === 'true',
        canonicalBase: (formData.get('global_canonicalBase') as string) || currentConfig.global.canonicalBase,
      },
      pages: {},
      schema: {
        orgName: (formData.get('schema_orgName') as string) || currentConfig.schema.orgName,
        orgUrl: (formData.get('schema_orgUrl') as string) || currentConfig.schema.orgUrl,
        orgLogo: (formData.get('schema_orgLogo') as string) || currentConfig.schema.orgLogo,
        address: (formData.get('schema_address') as string) || currentConfig.schema.address,
        phone: (formData.get('schema_phone') as string) || currentConfig.schema.phone,
        email: (formData.get('schema_email') as string) || currentConfig.schema.email,
      }
    }

    // Build pages SEO
    const pageKeys = ['inicio', 'servicios', 'empresa', 'portafolio', 'contacto'] as const
    for (const page of pageKeys) {
      newConfig.pages[page] = {
        title: (formData.get(`page_${page}_title`) as string) || undefined,
        description: (formData.get(`page_${page}_description`) as string) || undefined,
        ogTitle: (formData.get(`page_${page}_ogTitle`) as string) || undefined,
        ogDescription: (formData.get(`page_${page}_ogDescription`) as string) || undefined,
        ogImage: (formData.get(`page_${page}_ogImage`) as string) || undefined,
        noindex: formData.get(`page_${page}_noindex`) === 'true',
        canonical: (formData.get(`page_${page}_canonical`) as string) || undefined,
      }
    }

    await prisma.configMaster.upsert({
      where: { tenantId_key: { tenantId: 'single', key: 'seo_config' } },
      update: { value: JSON.stringify(newConfig) },
      create: { tenantId: 'single', key: 'seo_config', value: JSON.stringify(newConfig) }
    })

    await prisma.seoHistory.create({
       data: {
         userId: session?.supabaseUserId || 'DEV',
         metaTitle: newConfig.global.siteTitle,
         metaDescription: newConfig.global.description,
       }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/servicios')
    revalidatePath('/admin/developer/seo')
    
    return { success: true, message: 'Configuración SEO guardada correctamente.' }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: 'Sin permisos o error al guardar SEO.' }
  }
}
