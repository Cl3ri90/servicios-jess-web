import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      name: 'Servicios Jess',
      primaryColor: '#ea580c',
      metaTitle: 'Servicios Jess | Gomas industriales, plásticos de ingeniería y maestranza',
    },
  });

  const baseFlags = [
    { key: 'configuracion_owner', name: 'Datos Básicos (Owner)', isActive: true, ownerVisible: true, ownerEditable: true, publicVisible: false },
    { key: 'capacidades', name: 'Capacidades Industriales', isActive: true, ownerVisible: true, ownerEditable: false, publicVisible: true },
    { key: 'portafolio', name: 'Portafolio Operativo', isActive: false, ownerVisible: true, ownerEditable: false, publicVisible: true },
    { key: 'realizados', name: 'Proyectos Realizados', isActive: false, ownerVisible: true, ownerEditable: false, publicVisible: true },
    { key: 'trust', name: 'Empresas que confían', isActive: false, ownerVisible: true, ownerEditable: false, publicVisible: true },
    { key: 'indicadores', name: 'KPIs Mantenimiento', isActive: false, ownerVisible: true, ownerEditable: false, publicVisible: true },
    { key: 'seo_manager', name: 'SEO Core', isActive: true, ownerVisible: false, ownerEditable: false, publicVisible: false },
    { key: 'popup_promocional', name: 'Pop-Up Comercial', isActive: false, ownerVisible: false, ownerEditable: false, publicVisible: true },
    { key: 'cta_flotante', name: 'Botón Flotante CTA', isActive: true, ownerVisible: false, ownerEditable: false, publicVisible: true },
    { key: 'cta_principal', name: 'Llamada de Acción', isActive: true, ownerVisible: true, ownerEditable: true, publicVisible: true }
  ];

  for (const flag of baseFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }

  const baseCapabilities = [
    {
      title: 'Soluciones Industriales a Medida',
      description: 'Ofrecemos diseño y fabricación de soluciones industriales personalizadas, adaptadas a los requerimientos específicos de tu operación.',
      shortDescription: 'Diseño y fabricación a la medida.',
      order: 1,
      isActive: true,
    },
    {
      title: 'Fabricación Metalmecánica de Precisión',
      description: 'Procesos de mecanizado y armado estructural con tolerancias estrictas, asegurando la durabilidad de los componentes en ambientes hostiles.',
      shortDescription: 'Mecanizado y armado con máxima exactitud.',
      order: 2,
      isActive: true,
    },
    {
      title: 'Ingeniería Estructural',
      description: 'Cálculo, diseño y montaje de estructuras metálicas pesadas para naves industriales y soporte logístico.',
      shortDescription: 'Estructuras metálicas para carga crítica.',
      order: 3,
      isActive: true,
    },
    {
      title: 'Mantención y Reparación Industrial',
      description: 'Servicios de reparación preventiva y correctiva de maquinaria industrial, minimizando el tiempo de inactividad operativo.',
      shortDescription: 'Reparación preventiva y predictiva.',
      order: 4,
      isActive: true,
    }
  ];

  for (const cap of baseCapabilities) {
    const existing = await prisma.serviceCapability.findFirst({
      where: { title: cap.title },
    });
    if (!existing) {
      await prisma.serviceCapability.create({
        data: cap,
      });
    }
  }

  console.log('Seed exitoso');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
