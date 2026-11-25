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
    <main id='main-content' className='frame ruled' tabIndex={-1}>
      <header className='page-intro'>
        <h1>Writing</h1>
        <p>{BLOG_DESCRIPTION}</p>
      </header>
      <PostList posts={posts} />
    </main>
  );
}
