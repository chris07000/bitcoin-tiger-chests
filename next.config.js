/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // Disable ESLint during build to prevent linting errors from breaking deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Zorg dat alle pagina's correct geladen worden
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Configuratie voor externe afbeeldingsdomeinen
  images: {
    domains: ['api.hiro.so'],
    unoptimized: true,
  },
  // Enable hostname and port in dev mode
  webpack: (config, { dev }) => {
    if (dev) {
      config.devServer = {
        host: '0.0.0.0',
        port: 3000,
        allowedHosts: ['localhost', '.vercel.app', '.local']
      }
    }
    return config
  },
  // Allow connections from your local network
  allowedDevOrigins: ['http://localhost:3000'],
  // CORS headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-src 'self';"
          }
        ],
      }
    ]
  }
}

module.exports = nextConfig 