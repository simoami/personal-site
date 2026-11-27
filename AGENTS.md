<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project standards

- Use strict TypeScript with concrete types. Avoid `any`, unexplained non-null assertions and `@ts-ignore`.
- Run Biome with zero warnings. Use single quotes and two spaces for indentation.
- Use the smallest solution that meets the requirements. Prefer Next.js primitives, including `next/font`, the Metadata API, `sitemap.ts` and `robots.ts`. Remove unused exports, demo assets and boilerplate.
- Put one React component in each file. Use kebab-case filenames for components under `components/`. Place private children in a sibling folder named after the parent. Name event handlers `handleXxx` and callback props `onXxx`.
- Use `UPPER_SNAKE_CASE` for module-level primitive and regex constants. Leave a blank line between top-level declarations and between unrelated blocks.
- Use `package.json` subpath imports (`#...`) across directories. Verify resolution in Turbopack, `tsc` and the Node test runner. Report resolver limitations. Avoid parent-relative imports and TypeScript `paths`.
- Give exported functions and components a one- to three-line JSDoc describing their purpose or guarantees. Omit `@param` and `@returns`. Explain why in comments. For non-trivial helpers, document the input shape and include a one-line example for each regex.
- Style with Tailwind v4 utilities through `@tailwindcss/postcss`. Use the semantic colors in `app/globals.css` (`bg-surface`, `text-muted`, `border-line`, `text-accent`), `px-gutter` and the `frame` utility, and `sm:`/`md:` variants for responsive changes. Dark is the default, and the `light:` variant targets the light override. Keep element selectors only for MDX output in `.post-body`.
- Write post diagrams as D2 in `diagrams/<slug>/`, then run `pnpm diagrams` to render light and dark SVGs into `public/images/posts/<slug>/`. Embed them in MDX with `<Diagram src='/images/posts/<slug>/<name>' alt='…' />`.
- Validate boundary data with a schema. Invalid frontmatter must fail the build with the filename and field.
- Handle failures explicitly. The decorative hero background skips browsers without WebGL2. Report import or mount failures once with `console.error`, the sole allowed `console` use.
- Describe current behavior in code, comments and docs. Keep docs short and factual, with sentence-case headings and no emoji.
- Add Node built-in tests alongside new logic. Cover frontmatter validation, draft handling, date sorting and slug derivation, including failure cases. Name tests after behavior.
- Use Conventional Commit subjects. Omit co-author and AI attribution trailers.
- Check interface changes against the [Vercel web interface guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/refs/heads/main/AGENTS.md).
