import type { Post } from '#lib/content';
import { formatPostDate } from '#lib/site';

/** Renders links for published posts and plain-text previews for drafts. */
export function PostList({ posts }: { posts: Post[] }) {
  if (!posts.length) return <p className='empty-state'>No posts yet.</p>;

  return (
    <ul className='post-list'>
      {posts.map((post) => (
        <li key={post.slug}>
          {post.status === 'published' ? (
            <a className='post-row' href={`/blog/${post.slug}`}>
              <span>{post.title}</span>
              <time className='post-meta' dateTime={post.date}>
                {formatPostDate(post.date)}
              </time>
            </a>
          ) : (
            <div className='post-row'>
              <span>{post.title}</span>
              <span className='post-meta'>Coming soon</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
