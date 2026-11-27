import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Diagram } from '#components/diagram';
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
    components: { Diagram },
    options: {
      mdxOptions: {
        // GitHub-flavored Markdown adds tables.
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
    },
  });

  return (
    <main id='main-content' className='flex-1' tabIndex={-1}>
      <article>
        <header className='grid gap-4 border-b border-line px-gutter pt-9 pb-9 wrap-anywhere sm:pt-14'>
          <a
            className='inline-flex min-h-11 items-center gap-2 justify-self-start font-mono text-sm underline underline-offset-[0.2em]'
            href='/blog'
          >
            <span aria-hidden='true'>←</span> All posts
          </a>
          <h1 className='text-[28px] leading-none font-semibold tracking-[-0.05em] sm:text-[32px]'>
            {post.title}
          </h1>
          <time
            className='font-mono text-[13px]/normal text-muted tabular-nums'
            dateTime={post.date}
          >
            {formatPostDate(post.date)}
          </time>
        </header>
        <div className='post-body'>{content}</div>
      </article>
    </main>
  );
}
