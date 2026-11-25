import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import { getPosts } from '#lib/content';
import { formatPostDate } from '#lib/site';

export const dynamicParams = false;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function requirePublishedPost(params: PostPageProps['params']) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) notFound();
  return post;
}

/** Restricts prerendering to published files. */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ slug }) => ({ slug }));
}

/** Supplies the published post's title, summary and canonical URL. */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await requirePublishedPost(params);
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
      types: { 'application/rss+xml': '/feed.xml' },
    },
  };
}

/** Compiles trusted local MDX and renders it as a server-rendered article. */
export default async function PostPage({ params }: PostPageProps) {
  const post = await requirePublishedPost(params);
  const { content } = await compileMDX({
    source: { value: post.body, path: `content/posts/${post.slug}.mdx` },
    options: { mdxOptions: { rehypePlugins: [rehypeHighlight] } },
  });

  return (
    <main id='main-content' className='frame ruled' tabIndex={-1}>
      <article>
        <header className='page-intro'>
          <a className='back-link' href='/blog'>
            <span aria-hidden='true'>←</span> All posts
          </a>
          <h1>{post.title}</h1>
          <time className='post-meta' dateTime={post.date}>
            {formatPostDate(post.date)}
          </time>
        </header>
        <div className='post-body'>{content}</div>
      </article>
    </main>
  );
}
