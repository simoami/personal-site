import { getPosts } from '#lib/content';
import { BLOG_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from '#lib/site';

export const dynamic = 'force-static';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/** Serves a prerendered RSS feed with published posts only. */
export async function GET() {
  const posts = await getPosts();
  const items = posts.map(({ slug, title, description, date }) => {
    const url = escapeXml(`${SITE_ORIGIN}/blog/${slug}`);
    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
    </item>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(`${SITE_ORIGIN}/blog`)}</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(`${SITE_ORIGIN}/feed.xml`)}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
  );
}
