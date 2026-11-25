import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { type TestContext, test } from 'node:test';
import { getPosts, getProjects } from '#lib/content';

async function createEntries(
  context: TestContext,
  entries: Record<string, string>,
) {
  const directory = await mkdtemp(join(tmpdir(), 'simo-site-content-'));
  context.after(() => rm(directory, { recursive: true }));
  await Promise.all(
    Object.entries(entries).map(([name, source]) =>
      writeFile(join(directory, name), source),
    ),
  );
  return directory;
}

function postSource(date: string, status = 'published') {
  return `---
title: "A note: on design"
description: A short note.
date: ${date}
status: ${status}
---

A paragraph.
`;
}

function projectSource(name: string, order: number, highlight: boolean) {
  return `---
name: ${name}
tag: Testing
description: A short project description.
href: https://example.com/${name}
order: ${order}
highlight: ${highlight}
---
`;
}

test('derives the slug from an MDX filename and preserves the post body', async (context) => {
  const directory = await createEntries(context, {
    'hello-world.mdx': postSource('2026-11-25').replaceAll('\n', '\r\n'),
    'notes.md': 'This extension is ignored.',
  });

  const posts = await getPosts({ directory });

  assert.deepEqual(posts, [
    {
      slug: 'hello-world',
      title: 'A note: on design',
      description: 'A short note.',
      date: '2026-11-25',
      status: 'published',
      body: 'A paragraph.',
    },
  ]);
});

test('sorts posts by instant and includes drafts only when requested', async (context) => {
  const directory = await createEntries(context, {
    'alpha.mdx': postSource('2024-02-29'),
    'beta.mdx': postSource('2024-02-29T02:00:00+03:00'),
    'gamma.mdx': postSource('2026-11-25', 'draft'),
    'zed.mdx': postSource('2024-02-29T00:00:00Z'),
  });

  assert.deepEqual(
    (await getPosts({ directory })).map(({ slug }) => slug),
    ['alpha', 'zed', 'beta'],
  );
  assert.deepEqual(
    (await getPosts({ directory, includeDrafts: true })).map(
      ({ slug }) => slug,
    ),
    ['gamma', 'alpha', 'zed', 'beta'],
  );
});

test('rejects missing frontmatter and malformed YAML with the filename', async (context) => {
  const missing = await createEntries(context, {
    'missing.mdx': `A paragraph.\n${postSource('2026-11-25')}`,
  });
  const malformed = await createEntries(context, {
    'malformed.mdx': '---\ntitle: [Bad YAML\n---\n',
  });

  await assert.rejects(
    getPosts({ directory: missing }),
    /missing\.mdx: frontmatter: expected a leading YAML block/,
  );
  await assert.rejects(
    getPosts({ directory: malformed }),
    /malformed\.mdx: frontmatter: .*flow sequence/i,
  );
});

test('rejects invalid draft dates, statuses and required fields before filtering', async (context) => {
  const badDate = await createEntries(context, {
    'bad-date.mdx': postSource('2025-02-29', 'draft'),
  });
  const badStatus = await createEntries(context, {
    'bad-status.mdx': postSource('2026-11-25', 'private'),
  });
  const noTitle = await createEntries(context, {
    'no-title.mdx': postSource('2026-11-25').replace(
      'title: "A note: on design"\n',
      '',
    ),
  });

  await assert.rejects(
    getPosts({ directory: badDate }),
    /bad-date\.mdx: date:/,
  );
  await assert.rejects(
    getPosts({ directory: badStatus }),
    /bad-status\.mdx: status:/,
  );
  await assert.rejects(
    getPosts({ directory: noTitle }),
    /no-title\.mdx: title:/,
  );
});

test('rejects filenames that cannot be used as post slugs', async (context) => {
  const directory = await createEntries(context, {
    'Bad Slug.mdx': postSource('2026-11-25'),
  });

  await assert.rejects(getPosts({ directory }), /Bad Slug\.mdx: slug:/);
});

test('sorts projects by order and validates URLs and booleans', async (context) => {
  const directory = await createEntries(context, {
    'first.md': projectSource('first', 2, false),
    'second.md': projectSource('second', 1, true),
  });
  const invalid = await createEntries(context, {
    'invalid.md': projectSource('invalid', 1, true)
      .replace('https://example.com/invalid', 'file:///invalid')
      .replace('highlight: true', 'highlight: "true"'),
  });

  assert.deepEqual(
    (await getProjects(directory)).map(({ name, highlight }) => [
      name,
      highlight,
    ]),
    [
      ['second', true],
      ['first', false],
    ],
  );
  await assert.rejects(
    getProjects(invalid),
    /invalid\.md: href:.*\nhighlight:/,
  );
});
