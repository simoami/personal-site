import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '#lib/site';

/** Allows crawlers to index the public site and points them to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
