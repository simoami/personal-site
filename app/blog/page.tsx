import type { Metadata } from 'next';
import { PostList } from '#components/post-list';
import { getPosts } from '#lib/content';
import { BLOG_DESCRIPTION } from '#lib/site';

export const metadata: Metadata = {
  title: 'Writing',
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/feed.xml' },
  },
};

/** Lists published writing and upcoming posts. */
export default async function Blog() {
  const posts = await getPosts({ includeDrafts: true });

  return (
    <main id='main-content' className='flex-1' tabIndex={-1}>
      <header className='grid gap-4 border-b border-line px-gutter pt-9 pb-9 wrap-anywhere sm:pt-14'>
        <h1 className='text-[28px] leading-none font-semibold tracking-[-0.05em] sm:text-[32px]'>
          Writing
        </h1>
        <p className='text-lg text-soft'>{BLOG_DESCRIPTION}</p>
      </header>
      <PostList posts={posts} />
    </main>
  );
}
