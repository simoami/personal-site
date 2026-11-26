import { z } from 'zod';

export const SITE_NAME = 'Simo Moujami';

/** The home intro block the page field fades out around. */
export const HERO_COPY_ID = 'hero-copy';

export const SITE_DESCRIPTION =
  'Senior Solutions Architect in New York. Notes on prototyping AI systems.';

export const BLOG_DESCRIPTION = 'Notes on prototyping AI systems.';

// Example protocol for the build-time site URL: `https`.
const HTTP_PROTOCOL = /^https?$/;

const VERCEL_PRODUCTION_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const SITE_URL = z
  .url({ protocol: HTTP_PROTOCOL })
  .parse(
    process.env.SITE_URL ??
      (VERCEL_PRODUCTION_URL
        ? `https://${VERCEL_PRODUCTION_URL}`
        : 'http://localhost:3000'),
  );

export const SITE_ORIGIN = new URL(SITE_URL).origin;

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

/** Formats a post date in UTC so date-only frontmatter keeps its calendar day. */
export function formatPostDate(date: string) {
  return dateFormat.format(new Date(date));
}
