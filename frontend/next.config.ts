import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const isDevelopment = process.env.NODE_ENV === 'development';

// Development CSP (more permissive)
const developmentCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: https://lh3.googleusercontent.com https://graph.facebook.com",
  "connect-src 'self' http://localhost:5000 https://apis.google.com https://accounts.google.com https://play.google.com https://connect.facebook.net",
  "frame-src 'self' http://localhost:5000 https://accounts.google.com https://www.facebook.com www.google.com https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "media-src 'self' https://vemotnha.s3.ap-southeast-1.amazonaws.com"
].join('; ');

// Production CSP (more restrictive)
const productionCSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://connect.facebook.net https://www.google-analytics.com`, // todo: consider removing 'unsafe-inline' 'unsafe-eval' in production use 'nonce-${nonce}' if needed
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: https://lh3.googleusercontent.com https://graph.facebook.com",
  "connect-src * https://vemotnha.ddns.net http://155.94.144.195:5001 https://apis.google.com https://accounts.google.com https://connect.facebook.net",
  "frame-src 'self' https://vemotnha.ddns.net https://accounts.google.com https://www.facebook.com www.google.com https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "media-src 'self' https://vemotnha.s3.ap-southeast-1.amazonaws.com"
].join('; ');

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  // Read allowedDevOrigins from environment variables
  allowedDevOrigins: process.env.NEXT_PUBLIC_ALLOWED_DEV_ORIGINS?.split(',') || ['localhost'],

  // Headers configuration with CSP
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
    ];
  },

  // Image domains configuration
  images: {
    domains: (process.env.NEXT_PUBLIC_IMAGE_DOMAINS?.split(',') || []),
  },

  // Page extensions for MDX support
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

export default withMDX(nextConfig);
