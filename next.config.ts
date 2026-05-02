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

  // 3. Tus encabezados de seguridad existentes (intactos)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  }
};

export default nextConfig;
