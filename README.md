# mariopenglee.com

My personal website — a minimal **amber-CRT terminal**.

- React + TypeScript + Vite
- Monospace (IBM Plex Mono), box-drawing window frame, blinking cursor, faint scanlines
- Monochrome: light "paper" theme + dark "phosphor" theme (toggle, persisted)
- Markdown blog (`/blog`) + curated `selected work` list in about
- Interactive command bar: `help`, `ls`, `blog`, `theme`, `github`, …

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # outputs to /docs (GitHub Pages)
```

## Writing a blog post

Drop a markdown file in `src/posts/`. It's picked up automatically, sorted by
date. Frontmatter:

```markdown
---
title: My post title
date: 2026-06-09
summary: One-line description shown in the blog index.
---

Body in **markdown** — headings, lists, code blocks, quotes, links.
```

The filename (without `.md`) becomes the URL slug: `src/posts/my-post.md`
→ `/blog/my-post`.

## Deploy

GitHub Pages serves from the `/docs` folder on the default branch
(custom domain `mariopenglee.com` via `docs/CNAME`).
`npm run build` regenerates `/docs`; commit and push to publish.
