import type { MetadataRoute } from 'next';
import { getPosts } from '#lib/content';
import { SITE_ORIGIN } from '#lib/site';

/** Lists canonical URLs for the site and all published posts. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: `${SITE_ORIGIN}/` },
    { url: `${SITE_ORIGIN}/blog` },
    ...posts.map(({ slug, date }) => ({
      url: `${SITE_ORIGIN}/blog/${slug}`,
      lastModified: date,
    })),
  ];
}
