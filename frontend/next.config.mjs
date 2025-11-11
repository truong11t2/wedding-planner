import createMDX from '@next/mdx'
 
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})
 
/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV === 'development';

// Development CSP (more permissive)
const developmentCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https: http:",
  "connect-src 'self' http://localhost:5000 ws://localhost:5000 https://apis.google.com https://accounts.google.com",
  "frame-src 'self' https://accounts.google.com https://www.facebook.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ');

// Production CSP (more restrictive)
const productionCSP = [
  "default-src 'self'",
  "script-src 'self' https://apis.google.com https://connect.facebook.net https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: https://lh3.googleusercontent.com https://graph.facebook.com",
  "connect-src 'self' https://your-api-domain.com https://apis.google.com",
  "frame-src 'self' https://accounts.google.com https://www.facebook.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ');

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isDevelopment ? developmentCSP : productionCSP
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  images: {
    domains: [
      'localhost',
      'lh3.googleusercontent.com',
      'graph.facebook.com',
      'platform-lookaside.fbsbx.com',
    ],
  },
}

export default nextConfig;