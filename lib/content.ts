import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';

// Example frontmatter: `---\ntitle: Hello\n---\nPost text`.
const FRONTMATTER = /^\uFEFF?---\r?\n([\s\S]*?)^---[\t ]*\r?$(?:\n|$)/m;

// Example slug: `hello-world`.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Example URL protocol: `https`.
const HTTP_PROTOCOL = /^https?$/;

const CONTENT_DIRECTORY = join(process.cwd(), 'content');

const nonEmptyText = z.string().trim().min(1);

const postSchema = z.strictObject({
  title: nonEmptyText,
  description: nonEmptyText,
  date: z.union([z.iso.date(), z.iso.datetime({ offset: true })], {
    error: 'Expected an ISO date (YYYY-MM-DD) or a timestamp with a time zone',
  }),
  status: z.enum(['published', 'draft']),
});

const projectSchema = z.strictObject({
  name: nonEmptyText,
  tag: nonEmptyText,
  description: nonEmptyText,
  href: z.url({ protocol: HTTP_PROTOCOL, normalize: true }),
  order: z.number(),
  highlight: z.boolean(),
});

export type Post = z.infer<typeof postSchema> & { slug: string; body: string };

export type Project = z.infer<typeof projectSchema>;

/** Reads a Markdown file with a leading YAML mapping and validates that mapping. */
async function readEntry<T>(file: string, schema: z.ZodType<T>) {
  const source = await readFile(file, 'utf8');
  const match = FRONTMATTER.exec(source);

  if (match?.index !== 0 || match[1] === undefined) {
    throw new Error(
      `${file}: frontmatter: expected a leading YAML block delimited by ---`,
    );
  }

  let data: unknown;

  try {
    data = parse(match[1]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${file}: frontmatter: ${message}`, { cause: error });
  }

  const result = schema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const field = issue.path.join('.') || 'frontmatter';
      return `${field}: ${issue.message}`;
    });
    throw new Error(`${file}: ${issues.join('\n')}`);
  }

  return { data: result.data, body: source.slice(match[0].length).trim() };
}

/** Lists regular content files ending in the given extension, such as `.mdx`. */
async function entryFiles(directory: string, extension: string) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => join(directory, entry.name));
}

/** Loads validated posts, sorted newest first, with optional draft filtering. */
export async function getPosts({
  directory = join(CONTENT_DIRECTORY, 'posts'),
  includeDrafts = false,
} = {}): Promise<Post[]> {
  const files = await entryFiles(directory, '.mdx');
  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = basename(file, '.mdx');

      if (!SLUG.test(slug)) {
        throw new Error(
          `${file}: slug: use lowercase letters, digits and single hyphens`,
        );
      }

      const { data, body } = await readEntry(file, postSchema);
      return { ...data, slug, body };
    }),
  );

  return posts
    .filter((post) => includeDrafts || post.status === 'published')
    .toSorted(
      (a, b) =>
        Date.parse(b.date) - Date.parse(a.date) || a.slug.localeCompare(b.slug),
    );
}

/** Loads validated project cards in ascending display order. */
export async function getProjects(
  directory = join(CONTENT_DIRECTORY, 'projects'),
): Promise<Project[]> {
  const files = await entryFiles(directory, '.md');
  const entries = await Promise.all(
    files.map((file) => readEntry(file, projectSchema)),
  );

  return entries
    .map(({ data }) => data)
    .toSorted((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}
