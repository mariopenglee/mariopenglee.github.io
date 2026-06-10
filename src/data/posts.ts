import { marked } from 'marked';

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  summary: string;
  html: string; // rendered body (authored by me — trusted)
}

marked.setOptions({ gfm: true, breaks: false });

// Author posts by dropping a markdown file in src/posts/. Frontmatter:
//   ---
//   title: …
//   date: 2026-06-01
//   summary: …
//   ---
const raw = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(src: string): { meta: Record<string, string>; body: string } {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) return { meta: {}, body: src };
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) {
      meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return { meta, body: src.slice(m[0].length) };
}

export const POSTS: Post[] = Object.entries(raw)
  .map(([path, src]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { meta, body } = parseFrontmatter(src);
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '',
      summary: meta.summary ?? '',
      html: marked.parse(body) as string,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string): Post | undefined =>
  POSTS.find((p) => p.slug === slug);
