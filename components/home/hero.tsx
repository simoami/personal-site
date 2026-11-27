import { Headshot } from '#components/home/hero/headshot';
import { HERO_COPY_ID, SITE_NAME } from '#lib/site';

const EMAIL_HREF = 'mailto:hello@example.com';

const LINK =
  'inline-flex min-h-11 items-center gap-2 underline underline-offset-[0.2em]';

/** Displays the introduction, portrait and contact links over the page field. */
export function Hero() {
  return (
    <section
      id='top'
      className='border-b border-line px-gutter pt-8 pb-6 sm:pt-14 bg-surface/40'
      aria-labelledby='hero-title'
    >
      <div
        id={HERO_COPY_ID}
        className='flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10'
      >
        <div className='grid max-w-180 gap-3'>
          <h1
            id='hero-title'
            className='text-[28px] leading-none font-semibold tracking-[-0.05em] sm:text-[32px]'
            translate='no'
          >
            {SITE_NAME}
          </h1>
          <p className='font-mono text-xs tracking-[0.08em] text-muted uppercase'>
            Solutions Architect · New York
          </p>
          <p className='mt-5 max-w-[58ch] text-lg/[1.6] text-soft'>
            I turn business problems into system designs. Lately my focus is
            applied AI: working out where it fits, then prototyping working AI
            workloads that prove feasibility before anyone commits to a roadmap.
          </p>
          <ul className='flex flex-wrap items-center gap-x-5 font-mono text-sm'>
            <li>
              <a className={LINK} href='https://github.com/simoami'>
                GitHub <span aria-hidden='true'>↗</span>
              </a>
            </li>
            <li>
              <a className={LINK} href='https://www.linkedin.com/in/simoami'>
                LinkedIn <span aria-hidden='true'>↗</span>
              </a>
            </li>
            <li>
              <a className={LINK} href={EMAIL_HREF}>
                Email
              </a>
            </li>
          </ul>
        </div>
        <Headshot className='size-24 sm:size-38' />
      </div>
    </section>
  );
}
