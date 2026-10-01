import type { MetadataRoute } from 'next';

/**
 * Canonical site origin used for robots/sitemap URLs.
 * Override with NEXT_PUBLIC_SITE_URL when deploying to a different host.
 */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vemotnha.com.vn'
).replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Authenticated planner/tool pages and auth endpoints have no SEO value.
        disallow: [
          '/dashboard',
          '/budget',
          '/checklist',
          '/guests',
          '/timeline',
          '/photos',
          '/profile',
          '/invitation',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
