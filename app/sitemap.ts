import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.serviciosjess.cl';

  const staticRoutes = [
    '',
    '/empresa',
    '/servicios',
    '/portafolio',
    '/contacto',
    '/politicas-de-privacidad',
    '/terminos-comerciales',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
