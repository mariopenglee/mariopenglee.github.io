import { Link } from 'react-router-dom';
import Denoise from '../components/Denoise';
import TalkCard from '../components/TalkCard';
import { SITE, LINKS, TALKS, WORK } from '../data/site';
import { POSTS } from '../data/posts';
import './page.css';

const FEATURED = POSTS.slice(0, 3);

export default function Home() {
  return (
    <div className="fade page">
      <header className="hero">
        <h1 className="hero-name">
          <Denoise text={SITE.name} />
        </h1>
        <p className="hero-role">
          {SITE.role} at{' '}
          <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">
            {SITE.company}
          </a>
        </p>
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

      <div className="bio">
        <p>
          I'm a {SITE.role} of{' '}
          <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">
            {SITE.company}
          </a>
          , an LLM input compression proxy: it sits between a coding agent and
          the model and shrinks each request before it's billed, cutting token
          bills on long sessions by up to about 70% while keeping the output
          basically the same.
        </p>
        <p>
          Before that I was an AI Engineer at{' '}
          <a href="https://nexos.ai/" target="_blank" rel="noopener noreferrer">
            nexos.ai
          </a>
          , where I built the agent layer that lets a single interface plan,
          call tools, and run code safely across whatever models and data a
          company already uses.
        </p>
        <p>
          Before nexos I double-majored in Linguistics and Computer Science at
          UCLA (departmental honors, data science minor, Phi Beta Kappa), where
          I researched AI safety, interpretability, and how people and models
          learn language, across four labs. That's still the lens I bring to
          building agents now.
        </p>
        <p>
          These days I also contribute to open-source interpretability research
          at{' '}
          <a href="https://www.eleuther.ai/" target="_blank" rel="noopener noreferrer">
            EleutherAI
          </a>
          .
        </p>
      </div>

      {TALKS.length > 0 && (
        <section className="section">
          <p className="section-title">talks</p>
          <div className="talk-list">
            {TALKS.map((t) => (
              <TalkCard
                key={t.id}
                id={t.id}
                title={t.title}
                meta={t.meta}
                poster={t.poster}
              />
            ))}
          </div>
        </section>
      )}

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
          {POSTS.length > FEATURED.length && (
            <p className="section-more">
              <Link to="/blog">all writing →</Link>
            </p>
          )}
        </section>
      )}

      <section className="section">
        <p className="section-title">selected work</p>
        <ul className="work-list">
          {WORK.map((w) => (
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
    </div>
  );
}
