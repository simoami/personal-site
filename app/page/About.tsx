const about = [
  {
    title: 'How I work',
    body: 'I think visually. I use diagrams to explain complex systems, and I care about UX and design systems, so prototypes feel like real products.',
  },
  {
    title: 'Recent work',
    body: 'Agentic document pipelines with PII de-identification and human review, and multi-tenant platform architecture.',
  },
  {
    title: 'Earlier',
    body: 'Senior Solutions Architect at Lineate: discovery, pre-sales architecture and investor due diligence. Before that, consumer platforms for Spectrum at 1M+ users across 80+ microservices.',
  },
  {
    title: 'Stack',
    body: 'TypeScript · Node.js · Next.js · React · Python · Mastra · Vercel AI SDK · Inngest · PostgreSQL + pgvector · Neo4j · AWS',
  },
];

/** Presents four About cells in the same grid as the project cards. */
export function About() {
  return (
    <section id='about' aria-labelledby='about-title'>
      <div className='section-bar'>
        <h2 id='about-title' className='section-label'>
          About
        </h2>
      </div>
      <div className='cell-grid about-grid'>
        {about.map(({ title, body }) => (
          <div className='cell about-cell' key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
