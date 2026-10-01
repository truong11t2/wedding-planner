import type { MetadataRoute } from 'next';
import { getBlogPosts, getVendors } from '@/lib/mdx';

/**
 * Canonical site origin used for sitemap URLs.
 * Override with NEXT_PUBLIC_SITE_URL when deploying to a different host.
 */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vemotnha.com.vn'
).replace(/\/$/, '');

/** URL-safe absolute path. */
const url = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Public, indexable static routes.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: url('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: url('/blog'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: url('/vendor'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: url('/venues'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: url('/contact'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: url('/privacy'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: url('/terms'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic content: blog posts and vendors (read from the content/ directory).
  let blogRoutes: MetadataRoute.Sitemap = [];
  let vendorRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts = await getBlogPosts();
    blogRoutes = posts.map((post) => ({
      url: url(`/blog/${post.slug}`),
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // Content directory unavailable — skip dynamic blog entries.
  }

  try {
    const vendors = await getVendors();
    vendorRoutes = vendors.map((vendor) => ({
      url: url(`/vendor/${vendor.slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {
    // Content directory unavailable — skip dynamic vendor entries.
  }

  return [...staticRoutes, ...blogRoutes, ...vendorRoutes];
}
