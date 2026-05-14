import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Ampliamos el límite de subida para las Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb', 
    },
  },

  // 2. Autorizamos a Next.js para mostrar imágenes desde tu Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gtsrkqpvtvyedjzueusp.supabase.co', // Tu host específico
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 3. Tus encabezados de seguridad existentes (intactos) + CSP
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in;
      font-src 'self' data:;
      connect-src 'self' https://*.supabase.co https://*.supabase.in https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com;
      frame-src 'self' https://www.google.com https://maps.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // TODO: Mover a Content-Security-Policy después de QA y validar remover unsafe-inline/unsafe-eval
          { key: 'Content-Security-Policy', value: cspHeader }
        ]
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      {
        source: "/login",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      }
    ];
  }
};

export default nextConfig;
