import type { Metadata } from 'next';
import { About } from '#components/home/about';
import { Hero } from '#components/home/hero';
import { Projects } from '#components/home/projects';
import { PostList } from '#components/post-list';
import { getPosts, getProjects } from '#lib/content';
import { SITE_DESCRIPTION } from '#lib/site';

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
};

/** Renders the personal site with its project, About and writing sections. */
export default async function Home() {
  const [projects, posts] = await Promise.all([
    getProjects(),
    getPosts({ includeDrafts: true }),
  ]);

  return (
    <main id='main-content' tabIndex={-1}>
      <Hero />
      <div className='frame ruled'>
        <Projects projects={projects} />
        <About />
        <section id='writing' aria-labelledby='writing-title'>
          <div className='section-bar'>
            <h2 id='writing-title' className='section-label'>
              <span aria-hidden='true'>03 / </span>
              Writing
            </h2>
            <a href='/blog'>
              All posts <span aria-hidden='true'>→</span>
            </a>
          </div>
          <PostList posts={posts} />
        </section>
      </div>
    </main>
  );
}
