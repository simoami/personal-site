import type { Post } from '#lib/content';
import { formatPostDate } from '#lib/site';

const ROW =
  'flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border border-line bg-surface px-5 py-3 text-lg wrap-anywhere';

const META = 'font-mono text-[13px]/normal text-muted tabular-nums';

/** Renders links for published posts and plain-text previews for drafts. */
export function PostList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <p className='border-b border-line bg-surface px-gutter py-5.5 text-muted'>
        No posts yet.
      </p>
    );
  }

  return (
    <ul className='space-y-2 px-5 pb-5'>
      {posts.map((post) => (
        <PostRow key={post.slug} post={post} />
      ))}
    </ul>
  );
}

const PostRow = ({ post }: { post: Post }) => {
  return (
    <li>
      {post.status === 'published' ? (
        <a
          className={`${ROW} hover:bg-surface-hover hover:text-fg focus-visible:-outline-offset-3`}
          href={`/blog/${post.slug}`}
        >
          <span>{post.title}</span>
          <time className={META} dateTime={post.date}>
            {formatPostDate(post.date)}
          </time>
        </a>
      ) : (
        <div className={ROW}>
          <span>{post.title}</span>
          <span className={META}>Coming soon</span>
        </div>
      )}
    </li>
  );
};
