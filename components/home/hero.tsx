import { Background } from '#components/home/hero/background';
import { SITE_NAME } from '#lib/site';

const HERO_ID = 'top';

const COPY_ID = 'hero-copy';

const EMAIL_HREF = 'mailto:hello@example.com';

/** Displays the introduction and contact links over the decorative hero field. */
export function Hero() {
  return (
    <section id={HERO_ID} className='hero' aria-labelledby='hero-title'>
      <div className='frame ruled hero-inner'>
        <div id={COPY_ID} className='hero-copy'>
          <p className='section-label'>Senior Solutions Architect · New York</p>
          <h1 id='hero-title' translate='no'>
            {SITE_NAME}
          </h1>
          <p className='hero-intro'>
            I turn business problems into system designs. Lately my focus is
            applied AI: working out where it fits, then prototyping working AI
            workloads that prove feasibility before anyone commits to a roadmap.
          </p>
          <ul className='hero-links'>
            <li>
              <a href='https://github.com/simoami'>
                GitHub <span aria-hidden='true'>↗</span>
              </a>
            </li>
            <li>
              <a href='https://www.linkedin.com/in/simoami'>
                LinkedIn <span aria-hidden='true'>↗</span>
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF}>Email</a>
            </li>
          </ul>
        </div>
      </div>
      <Background heroId={HERO_ID} copyId={COPY_ID} />
    </section>
  );
}
