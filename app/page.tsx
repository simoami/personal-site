import type { Metadata } from 'next';
import { About } from '#app/page/About';
import { Hero } from '#app/page/Hero';
import { Projects } from '#app/page/Projects';
import { PostList } from '#components/PostList';
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
