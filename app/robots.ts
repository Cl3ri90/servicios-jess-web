import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/login',
          '/auth',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://www.serviciosjess.cl/sitemap.xml',
  };
}
