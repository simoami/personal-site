import { SectionBar } from '#components/section-bar';
import type { Project } from '#lib/content';

/** Shows ordered project cards with their repository links. */
export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id='projects' aria-labelledby='projects-title'>
      <SectionBar headingId='projects-title' number='01' title='Projects'>
        {projects.length ? (
          <ul className='grid gap-5 px-5 pb-5 border-b border-line md:grid-cols-3'>
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </ul>
        ) : (
          <p className='border-b border-line bg-surface px-gutter py-5.5 text-muted'>
            No projects yet.
          </p>
        )}
      </SectionBar>
    </section>
  );
}

const ProjectCard = ({ project }: { project: Project }) => {
  const url = new URL(project.href);

  return (
    <li className='min-w-0'>
      <a
        className='group flex h-full flex-col gap-2 px-5 py-4 wrap-anywhere bg-surface/80 hover:bg-surface-hover hover:text-fg focus-visible:-outline-offset-3 border border-line'
        href={project.href}
      >
        <div className='flex flex-wrap items-center gap-x-2.5 gap-y-1'>
          <h3
            className='text-xl/tight font-medium tracking-[-0.02em]'
            translate='no'
          >
            {project.name}
          </h3>
          {/* <span
            className='ms-auto shrink-0 rounded-full border border-line px-2.5 py-0.5 font-mono text-xs/normal text-soft data-[highlight=true]:border-accent data-[highlight=true]:text-accent'
            data-highlight={project.highlight}
          >
            {project.tag}
          </span> */}
        </div>
        <p className='text-base/[1.55] text-muted group-hover:text-soft'>
          {project.description}
        </p>
        <span
          className='mt-auto font-mono text-[13px]/normal'
          aria-hidden='true'
        >
          {url.host}
          {url.pathname} ↗
        </span>
      </a>
    </li>
  );
};
