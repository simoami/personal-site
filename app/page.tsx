import type { Metadata } from 'next';
import { Hero } from '#components/home/hero';
import { Projects } from '#components/home/projects';
import { PostList } from '#components/post-list';
import { SectionBar } from '#components/section-bar';
import { getPosts, getProjects } from '#lib/content';
import { SITE_DESCRIPTION } from '#lib/site';

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
};

/** Renders the personal site with its project and writing sections. */
export default async function Home() {
  const [projects, posts] = await Promise.all([
    getProjects(),
    getPosts({ includeDrafts: true }),
  ]);

  return (
    <main id='main-content' className='flex-1' tabIndex={-1}>
      <Hero />
      <Projects projects={projects} />
      <section id='writing' aria-labelledby='writing-title'>
        <SectionBar
          headingId='writing-title'
          number='02'
          title='Writing'
          action={
            <div>
              <a
                className='inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.08em] uppercase underline underline-offset-[0.2em] me-2'
                href='/blog'
              >
                All posts
              </a>
              <span aria-hidden='true'>→</span>
            </div>
          }
        />
        <PostList posts={posts} />
      </section>
    </main>
  );
}
