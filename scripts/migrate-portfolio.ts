import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const portfolios = [
  {
    title: 'Estructuras de Soporte',
    slug: 'estructuras-de-soporte',
    clientName: 'Minera Norte',
    publicClientName: 'Cliente Confidencial',
    showClientName: false,
    featuredImage: 'https://images.unsplash.com/photo-1541888087405-d14457ebddc1?q=80&w=1470&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1541888087405-d14457ebddc1?q=80&w=1470&auto=format&fit=crop',
    category: 'Ingeniería Pesada',
    industry: 'Minería',
    specs: 'Fabricación y calibración estructural para correas transportadoras.',
    shortDescription: 'Fabricación y calibración estructural para correas transportadoras.',
    isPublished: true,
  },
  {
    title: 'Mecanizado CNC Tolvas',
    slug: 'mecanizado-cnc-tolvas',
    clientName: 'Consorcio Logístico',
    publicClientName: 'Cliente Confidencial',
    showClientName: false,
    featuredImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1469&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1469&auto=format&fit=crop',
    category: 'Mecanizado',
    industry: 'Logística',
    specs: 'Reparación y mecanizado de componentes de desgaste de alto tonelaje.',
    shortDescription: 'Reparación y mecanizado de componentes de desgaste de alto tonelaje.',
    isPublished: true,
  }
];

async function main() {
  for (const item of portfolios) {
    await prisma.portfolio.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        ...item,
      },
    });
    console.log(`Upserted portfolio: ${item.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
