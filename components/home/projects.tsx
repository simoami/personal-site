import type { Project } from '#lib/content';

/** Shows ordered project cards with their repository links. */
export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id='projects' aria-labelledby='projects-title'>
      <div className='section-bar'>
        <h2 id='projects-title' className='section-label'>
          <span aria-hidden='true'>01 / </span>
          Projects
        </h2>
      </div>
      {projects.length ? (
        <ul className='cell-grid project-grid'>
          {projects.map((project) => {
            const url = new URL(project.href);

            return (
              <li key={project.href}>
                <a className='cell project-card' href={project.href}>
                  <span
                    className='project-tag'
                    data-highlight={project.highlight}
                  >
                    {project.tag}
                  </span>
                  <h3 translate='no'>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className='project-url' aria-hidden='true'>
                    {url.host}
                    {url.pathname} ↗
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className='empty-state'>No projects yet.</p>
      )}
    </section>
  );
}
