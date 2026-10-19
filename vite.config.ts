import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { marked } from 'marked'
import fs from 'node:fs'
import path from 'node:path'
import { SITE, BIO, LINKS, TALKS, WORK, RESEARCH, LEADERSHIP } from './src/data/site'

const ORIGIN = 'https://mariopenglee.com'

// hash routes (#/blog/x) are invisible to crawlers and agents, so point at the raw markdown copy instead
const abs = (url: string) => url.replace(/^#\/blog\/(.+)$/, `${ORIGIN}/blog/$1.md`)

function posts() {
  return fs
    .readdirSync('src/posts')
    .map((f) => {
      const src = fs.readFileSync(path.join('src/posts', f), 'utf8')
      const meta = Object.fromEntries(
        [...src.matchAll(/^(title|date|summary):\s*(.*)$/gm)].map((m) => [m[1], m[2].trim()]),
      )
      return { slug: f.replace(/\.md$/, ''), src, ...meta } as Record<string, string>
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

// static, JS-free copies of the site for LLMs, agents and scrapers:
// llms.txt, llms-full.txt, /blog/<slug>.md, sitemap.xml, and a prerendered fallback inside #root
function agentFiles(): Plugin {
  return {
    name: 'agent-files',
    apply: 'build',
    closeBundle() {
      const out = 'docs'
      const all = posts()
      const list = (items: typeof WORK) =>
        items
          .map((w) => `- **${w.title}**: ${w.desc}${w.links.map((l) => ` ([${l.name}](${abs(l.url)}))`).join('')}`)
          .join('\n')
      const home = [
        `# Mario Peng Lee`,
        `> ${SITE.role} of ${SITE.company}. ${SITE.tagline}`,
        BIO.join('\n\n'),
        `## links\n${LINKS.map((l) => `- [${l.name}](${l.url})`).join('\n')}\n- [X](https://x.com/mariopenglee)`,
        `## writing\n${all.map((p) => `- [${p.title}](${ORIGIN}/blog/${p.slug}.md) (${p.date}): ${p.summary}`).join('\n')}`,
        `## selected work\n${list(WORK)}`,
        `## research\n${list(RESEARCH)}`,
        `## leadership\n${list(LEADERSHIP)}`,
        `## talks\n${TALKS.map((t) => `- [${t.title}](${t.url}) (${t.meta})`).join('\n')}`,
      ].join('\n\n')

      fs.writeFileSync(`${out}/llms.txt`, home + '\n')
      fs.writeFileSync(
        `${out}/llms-full.txt`,
        [home, ...all.map((p) => `---\n\n<!-- ${ORIGIN}/blog/${p.slug}.md -->\n${p.src}`)].join('\n\n'),
      )
      fs.mkdirSync(`${out}/blog`, { recursive: true })
      for (const p of all) fs.writeFileSync(`${out}/blog/${p.slug}.md`, p.src)

      const urls = [
        [`${ORIGIN}/`, all[0]?.date],
        [`${ORIGIN}/llms.txt`, all[0]?.date],
        ...all.map((p) => [`${ORIGIN}/blog/${p.slug}.md`, p.date]),
      ]
      fs.writeFileSync(
        `${out}/sitemap.xml`,
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map(([u, d]) => `  <url><loc>${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`)
          .join('\n')}\n</urlset>\n`,
      )

      // React's createRoot replaces this on load; non-JS readers see it as is
      const index = `${out}/index.html`
      fs.writeFileSync(
        index,
        fs.readFileSync(index, 'utf8').replace('<div id="root"></div>', `<div id="root">${marked.parse(home)}</div>`),
      )
    },
  }
}

// https://vitejs.dev/config/
// Deployed to GitHub Pages from the /docs folder on the default branch.
export default defineConfig({
  plugins: [react(), agentFiles()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
