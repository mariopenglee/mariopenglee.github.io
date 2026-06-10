import Prompt from '../components/Prompt';
import { SITE, LINKS, WORK } from '../data/site';
import './page.css';

// figlet "Calvin S" — box-drawing letterforms, stays monospace-sized
const ART = [
  '┌┬┐┌─┐┬─┐┬┌─┐  ┌─┐┌─┐┌┐┌┌─┐  ┬  ┌─┐┌─┐',
  '│││├─┤├┬┘││ │  ├─┘├┤ ││││ ┬  │  ├┤ ├┤',
  '┴ ┴┴ ┴┴└─┴└─┘  ┴  └─┘┘└┘└─┘  ┴─┘└─┘└─┘',
].join('\n');

export default function Home() {
  return (
    <div className="fade page">
      <Prompt cmd="cat about.md" />

      <section className="panel">
        <span className="panel-title"><b>about.md</b></span>

        <h1 className="sr-only">{SITE.name}</h1>
        <pre className="hero-ascii" aria-hidden="true">
          {ART}
          <span className="cursor" />
        </pre>
        <p className="hero-role">
          {SITE.role} @ <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">{SITE.company}</a>
          <span className="dim"> — leading the agentic team</span>
        </p>
        <ul className="links">
          {LINKS.map((l) => (
            <li key={l.key}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                [{l.name}]
              </a>
            </li>
          ))}
        </ul>

        <hr className="hr hr--dash" />

        <div className="about stagger">
          <p>
            <span className="faint">› </span>
            Engineer who loves solving problems and connecting with people.
          </p>
          <p>
            <span className="faint">› </span>
            My passion is making technology accessible, inclusive, and safe for
            everyone — always working on projects and startups to create a
            positive impact.
          </p>
          <p>
            <span className="faint">› </span>
            UCLA alum — studied Linguistics, Computer Science, and Psychology,
            and researched AI safety and ethics.
          </p>
          <p>
            <span className="faint">› </span>
            Now an {SITE.role} at{' '}
            <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">{SITE.company}</a>,
            building the future of intelligent systems.
          </p>
        </div>

        <hr className="hr hr--dash" />

        <p className="label">selected work</p>
        <ul className="work-list">
          {WORK.map((w, i) => (
            <li className="work-item" key={w.title}>
              <span className="branch">{i === WORK.length - 1 ? '└─' : '├─'} </span>
              <span className="work-title">{w.title}</span>
              <span className="dim"> — {w.desc}</span>
              {w.links.map((l) => (
                <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer">
                  [{l.name}]
                </a>
              ))}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
