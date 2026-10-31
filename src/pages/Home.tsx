import { Link } from 'react-router-dom';
import Denoise from '../components/Denoise';
import TalkCard from '../components/TalkCard';
import { marked } from 'marked';
import { SITE, BIO, LINKS, TALKS, WORK, RESEARCH, LEADERSHIP, HIGHLIGHTS, FEATURED_POSTS, HOME_TALKS } from '../data/site';
import { POSTS } from '../data/posts';
import './page.css';

// curated order from site.ts; falls back to newest if a slug is missing
const FEATURED = FEATURED_POSTS.map((slug) => POSTS.find((p) => p.slug === slug)).filter(
  (p): p is (typeof POSTS)[number] => !!p,
);

export function TalkGrid({ talks }: { talks: typeof TALKS }) {
  return (
    <div className="talk-list">
      {talks.map((t) => (
        <TalkCard key={t.title} id={t.id} title={t.title} meta={t.meta} poster={t.poster} url={t.url} />
      ))}
    </div>
  );
}

export function WorkSection({ title, items }: { title: string; items: typeof WORK }) {
  return (
    <section className="section">
      <p className="section-title">{title}</p>
      <ul className="work-list">
        {items.map((w) => (
          <li className="work-item" key={w.title}>
            <div className="work-head">
              <span className="work-title">{w.title}</span>
              <span className="work-links">
                {w.links.map((l) => (
                  <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.name}
                  </a>
                ))}
              </span>
            </div>
            <p className="work-desc dim">{w.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <div className="fade page">
      <header className="hero">
        <h1 className="hero-name">
          <Denoise text={SITE.name} />
        </h1>
        <p className="hero-role">
          {SITE.role} of{' '}
          <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">
            {SITE.company}
          </a>
        </p>
        <p className="hero-role dim">{SITE.tagline}</p>
        <ul className="links">
          {LINKS.map((l) => (
            <li key={l.key}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </header>

      {HIGHLIGHTS.length > 0 && (
        <ul className="highlights">
          {HIGHLIGHTS.map((h) => (
            <li key={h.text}>
              {h.url ? (
                <a href={h.url} {...(h.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {h.text}
                </a>
              ) : (
                h.text
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="bio">
        {BIO.map((p) => (
          <p key={p} dangerouslySetInnerHTML={{ __html: marked.parseInline(p) as string }} />
        ))}
      </div>

      {FEATURED.length > 0 && (
        <section className="section">
          <p className="section-title">writing</p>
          <ul className="post-list">
            {FEATURED.map((p) => (
              <li className="post-item" key={p.slug}>
                <span className="post-date">{p.date}</span>
                <div className="post-main">
                  <Link to={`/blog/${p.slug}`} className="post-link">
                    {p.title}
                  </Link>
                  {p.summary && <p className="post-summary">{p.summary}</p>}
                </div>
              </li>
            ))}
          </ul>
          <p className="section-more">
            <Link to="/blog">all writing →</Link>
          </p>
        </section>
      )}

      <WorkSection title="selected work" items={WORK} />

      {TALKS.length > 0 && (
        <section className="section">
          <p className="section-title">talks</p>
          <TalkGrid talks={TALKS.slice(0, HOME_TALKS)} />
          {TALKS.length > HOME_TALKS && (
            <p className="section-more">
              <Link to="/talks">all {TALKS.length} talks and articles →</Link>
            </p>
          )}
        </section>
      )}

      <WorkSection title="research" items={RESEARCH} />
      <WorkSection title="leadership" items={LEADERSHIP} />
    </div>
  );
}
