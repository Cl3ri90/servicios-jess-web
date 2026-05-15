"use server";

import { prisma } from '@/lib/prisma'
import { revalidatePath, revalidateTag } from 'next/cache'
import { validateAdminAccess, checkOwnerEditableFlag } from '@/lib/admin/permissions'
import { uploadPublicFile } from '@/lib/supabase/storage'

// Valores por defecto en caso de que la DB esté vacía
const DEFAULT_SETTINGS = {
  maintenance: false,
  maintenanceText: 'Sistema en Mantenimiento Crítico. Volvemos pronto.',
  primaryColor: '#ea580c',
  textColor: '#f5f5f5',
  bgColor: '#0a0a0a',
  logoUrl: '',
  faviconUrl: '',
  headerText: 'SERVICIOS JESS',
  footerText: 'Expertos en metalmecánica de precisión e integración técnica.',
  contactEmail: 'proyectos@serviciosjess.cl',
  contactPhone: '+56 9 1234 5678',
  whatsappPhone: '+56912345678',
  address: 'Panamericana Norte Km. 100, Santiago',
  legalTerms: 'Términos y condiciones de servicios industriales.',
  legalPrivacy: 'Política de privacidad estricta. Tus datos de proyectos están protegidos.',
  heroTitle: 'Excelencia Metalmecánica y Estructural',
  heroSubtitle: 'Soluciones industriales de alta precisión.',
  heroBtnText: 'Cotizar Proyecto',
  heroBtnLink: '/contacto',
  heroSecBtnText: 'Nuestras Capacidades',
  heroSecBtnLink: '/servicios',
  heroBgUrl: '',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=',
  devSignature: 'Diseñado y Desarrollado por Antigravity',
  devSignatureUrl: 'https://antigravity.dev',
  showHero: true,
  showServices: true,
  showClients: true,
  showMetrics: true,
  showIndustrialCTA: true,
  metaTitle: 'Servicios Jess | Gomas industriales, plásticos de ingeniería y maestranza',
  metaDescription: 'Expertos en gomas industriales, plásticos de ingeniería y maestranza. Fabricamos soluciones técnicas a medida para empresas e industrias.',
}

export type SiteSettings = typeof DEFAULT_SETTINGS

/**
 * Función de LECTURA (La que te estaba faltando)
 */
export async function getGlobalSettings(): Promise<SiteSettings> {
  const defaultBase = { ...DEFAULT_SETTINGS }
  try {
    const record = await prisma.siteConfig.findUnique({
      where: { id: "singleton" }
    })
    
    if (!record) return defaultBase
    
    return {
      ...defaultBase,
      maintenance: record.isMaintenance,
      primaryColor: record.primaryColor || defaultBase.primaryColor,
      heroBgUrl: record.heroBgUrl || defaultBase.heroBgUrl,
      logoUrl: record.logoUrl || defaultBase.logoUrl,
      faviconUrl: record.faviconUrl || defaultBase.faviconUrl,
      headerText: record.name || defaultBase.headerText,
      contactEmail: record.contactEmail || defaultBase.contactEmail,
      contactPhone: record.contactPhone || defaultBase.contactPhone,
      address: record.contactAddress || defaultBase.address,
      heroTitle: record.heroTitle || defaultBase.heroTitle,
      heroSubtitle: record.heroSubtitle || defaultBase.heroSubtitle,
      devSignature: record.devSignature || defaultBase.devSignature,
      devSignatureUrl: record.devSignatureUrl || defaultBase.devSignatureUrl,
      whatsappPhone: record.whatsappPhone || defaultBase.whatsappPhone,
      mapEmbedUrl: record.mapEmbedUrl || defaultBase.mapEmbedUrl,
      footerText: record.footerText || defaultBase.footerText,
      legalTerms: record.legalTerms || defaultBase.legalTerms,
      legalPrivacy: record.legalPrivacy || defaultBase.legalPrivacy,
      heroBtnText: record.heroBtnText || defaultBase.heroBtnText,
      heroBtnLink: record.heroBtnLink || defaultBase.heroBtnLink,
      heroSecBtnText: record.heroSecBtnText || defaultBase.heroSecBtnText,
      heroSecBtnLink: record.heroSecBtnLink || defaultBase.heroSecBtnLink,
      showHero: record.showHero ?? defaultBase.showHero,
      showServices: record.showServices ?? defaultBase.showServices,
      showClients: record.showClients ?? defaultBase.showClients,
      showMetrics: record.showMetrics ?? defaultBase.showMetrics,
      showIndustrialCTA: record.showIndustrialCTA ?? defaultBase.showIndustrialCTA,
      metaTitle: record.metaTitle || defaultBase.metaTitle,
      metaDescription: record.metaDescription || defaultBase.metaDescription,
    }
  } catch (error) {
    console.warn('Error cargando configuración, usando valores por defecto')
    return defaultBase
  }
}

/**
 * Función de ESCRITURA (Actualizada con Storage)
 */
export async function updateGlobalSettings(formData: FormData) {
  await validateAdminAccess("OWNER");
  await checkOwnerEditableFlag("configuracion_owner");

  try {
    const current = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });

    let logoUrl = current?.logoUrl || '';
    let faviconUrl = current?.faviconUrl || '';
    let heroBgUrl = current?.heroBgUrl || '';

    const logoFile = formData.get('logoFile') as File;
    const faviconFile = formData.get('faviconFile') as File;
    const heroBgFile = formData.get('heroBgFile') as File;

    if (logoFile && logoFile.size > 0) {
      const upload = await uploadPublicFile({ file: logoFile, bucket: 'servicios-jess-assets', path: 'branding' });
      if (!upload.success) return { success: false, error: `Error parcial subiendo logo: ${upload.error}` };
      logoUrl = upload.publicUrl!;
    }

    if (faviconFile && faviconFile.size > 0) {
      const upload = await uploadPublicFile({ file: faviconFile, bucket: 'servicios-jess-assets', path: 'branding' });
      if (!upload.success) return { success: false, error: `Error parcial subiendo favicon: ${upload.error}` };
      faviconUrl = upload.publicUrl!;
    }
    
    if (heroBgFile && heroBgFile.size > 0) {
      const upload = await uploadPublicFile({ file: heroBgFile, bucket: 'servicios-jess-assets', path: 'branding' });
      if (!upload.success) return { success: false, error: `Error parcial subiendo imagen hero: ${upload.error}` };
      heroBgUrl = upload.publicUrl!;
    }

    const updateData = {
      name: formData.get('headerText') as string || DEFAULT_SETTINGS.headerText,
      isMaintenance: formData.get('maintenance') === 'on' || formData.get('maintenance') === 'true',
      primaryColor: formData.get('primaryColor') as string || DEFAULT_SETTINGS.primaryColor,
      contactEmail: formData.get('contactEmail') as string || DEFAULT_SETTINGS.contactEmail,
      contactPhone: formData.get('contactPhone') as string || DEFAULT_SETTINGS.contactPhone,
      contactAddress: formData.get('address') as string || DEFAULT_SETTINGS.address,
      heroTitle: formData.get('heroTitle') as string || DEFAULT_SETTINGS.heroTitle,
      heroSubtitle: formData.get('heroSubtitle') as string || DEFAULT_SETTINGS.heroSubtitle,
      devSignature: formData.get('devSignature') as string || DEFAULT_SETTINGS.devSignature,
      devSignatureUrl: formData.get('devSignatureUrl') as string || DEFAULT_SETTINGS.devSignatureUrl,
      logoUrl: logoUrl,
      faviconUrl: faviconUrl,
      heroBgUrl: heroBgUrl,
      whatsappPhone: formData.get('whatsappPhone') as string || DEFAULT_SETTINGS.whatsappPhone,
      mapEmbedUrl: formData.get('mapEmbedUrl') as string || DEFAULT_SETTINGS.mapEmbedUrl,
      footerText: formData.get('footerText') as string || DEFAULT_SETTINGS.footerText,
      legalTerms: formData.get('legalTerms') as string || DEFAULT_SETTINGS.legalTerms,
      legalPrivacy: formData.get('legalPrivacy') as string || DEFAULT_SETTINGS.legalPrivacy,
      heroBtnText: formData.get('heroBtnText') as string || DEFAULT_SETTINGS.heroBtnText,
      heroBtnLink: formData.get('heroBtnLink') as string || DEFAULT_SETTINGS.heroBtnLink,
      heroSecBtnText: formData.get('heroSecBtnText') as string || DEFAULT_SETTINGS.heroSecBtnText,
      heroSecBtnLink: formData.get('heroSecBtnLink') as string || DEFAULT_SETTINGS.heroSecBtnLink,
      showHero: formData.get('showHero') === 'on' || formData.get('showHero') === 'true',
      showServices: formData.get('showServices') === 'on' || formData.get('showServices') === 'true',
      showClients: formData.get('showClients') === 'on' || formData.get('showClients') === 'true',
      showMetrics: formData.get('showMetrics') === 'on' || formData.get('showMetrics') === 'true',
      showIndustrialCTA: formData.get('showIndustrialCTA') === 'on' || formData.get('showIndustrialCTA') === 'true',
      metaTitle: formData.get('metaTitle') as string || DEFAULT_SETTINGS.metaTitle,
      metaDescription: formData.get('metaDescription') as string || DEFAULT_SETTINGS.metaDescription,
    };

    await prisma.siteConfig.upsert({
      where: { id: "singleton" },
      update: updateData,
      create: {
        id: "singleton",
        ...updateData,
      },
    });


    revalidatePath('/', 'layout');
    revalidatePath('/admin', 'layout');
    revalidatePath('/login');
    revalidatePath('/');
    revalidatePath('/empresa');
    revalidatePath('/servicios');
    revalidatePath('/portafolio');
    revalidatePath('/contacto');

    return { success: 'Configuración guardada y assets actualizados.' };

  } catch (error: any) {
    console.error(error);
    return { error: 'Error al procesar la actualización industrial.' };
  }
}

export async function updateTrustCarouselSpeed(speed: number) {
  await validateAdminAccess("DEVELOPER");
  
  try {
    // Check if SiteConfig exists
    const current = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    if (!current) {
       await prisma.siteConfig.create({
         data: { id: "singleton", name: DEFAULT_SETTINGS.headerText, trustCarouselSpeed: speed }
       });
    } else {
       await prisma.siteConfig.update({
         where: { id: "singleton" },
         data: { trustCarouselSpeed: speed }
       });
    }

    revalidatePath('/');
    revalidatePath('/admin/owner/clientes');
    revalidatePath('/admin/developer/clientes');
    
    return { success: 'Velocidad actualizada correctamente.' };
  } catch (error: any) {
    console.error('updateTrustCarouselSpeed error:', error);
    return { error: 'Error al actualizar velocidad.' };
  }
}