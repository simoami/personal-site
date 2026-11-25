# Simo Moujami

Personal site and statically generated blog. Use Node.js 26 and the pnpm version pinned in `package.json`.

```sh
pnpm install
pnpm dev
pnpm build
```

## Deployment

The site is static and requires no custom environment variables on Vercel. The build uses Vercel's production domain when available and `http://localhost:3000` otherwise. Set the optional `SITE_URL` to override the origin used in canonical URLs, the sitemap and RSS.

## Content

Add posts under `content/posts/` as `.mdx` files using lowercase, hyphenated filenames. Frontmatter requires `title`, `description`, an ISO `date` and `status` of `draft` or `published`. Drafts appear as “Coming soon.” Published posts get a page and are included in the sitemap and RSS.

Add project cards under `content/projects/` as `.md` files. Frontmatter requires `name`, `tag`, `description`, an HTTP(S) `href`, numeric `order` and boolean `highlight`.
