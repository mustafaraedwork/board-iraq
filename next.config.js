/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // تجاهل أخطاء ESLint و TypeScript أثناء البناء في Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // إعدادات الصور
  images: {
    domains: ['your-supabase-url.supabase.co'],
    unoptimized: true
  },
  // إعدادات لدعم RTL
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
  },
}

module.exports = nextConfig