# Simo Moujami

Personal site and statically generated blog. Use Node.js 26 and the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm dev
pnpm build
```

Set `SITE_URL` to the site's public origin at build time for canonical URLs, the sitemap and RSS. The default is `https://example.com`.

## Content

Add posts under `content/posts/` as `.mdx` files using lowercase, hyphenated filenames. Frontmatter requires `title`, `description`, an ISO `date` and `status` of `draft` or `published`. Drafts appear as “Coming soon.” Published posts get a page and are included in the sitemap and RSS.

Add project cards under `content/projects/` as `.md` files. Frontmatter requires `name`, `tag`, `description`, an HTTP(S) `href`, numeric `order` and boolean `highlight`.
