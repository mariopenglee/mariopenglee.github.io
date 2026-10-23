import { Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '../data/posts';
import ManifoldTiling from '../components/ManifoldTiling';
import BlockFactorization from '../components/BlockFactorization';
import NameDraw from '../components/NameDraw';
import CycleCritic from '../components/CycleCritic';
import IoiPerturb from '../components/IoiPerturb';
import KidsGap from '../components/KidsGap';
import TerminalTyping from '../components/TerminalTyping';
import BeliefRepo from '../components/BeliefRepo';
import LossWeighting from '../components/LossWeighting';
import RoleCollapseRates from '../components/RoleCollapseRates';
import WugTest from '../components/WugTest';
import './page.css';

// Interactive demos a post can embed by dropping `[[demo:key]]` on its own
// line in the markdown. The token renders as <p>[[demo:key]]</p>, which we
// split out and replace with the mapped component.
const DEMOS: Record<string, () => JSX.Element> = {
  'manifold-tiling': () => <ManifoldTiling />,
  'block-factorization': () => <BlockFactorization />,
  'name-draw': () => <NameDraw />,
  'cycle-critic': () => <CycleCritic />,
  'ioi-perturb': () => <IoiPerturb />,
  'kids-gap': () => <KidsGap />,
  'terminal-typing': () => <TerminalTyping />,
  'belief-repo': () => <BeliefRepo />,
  'loss-weighting': () => <LossWeighting />,
  'role-collapse-rates': () => <RoleCollapseRates />,
  'wug-test': () => <WugTest />,
};

const DEMO_RE = /<p>\[\[demo:([\w-]+)\]\]<\/p>/;

function renderBody(html: string) {
  const parts = html.split(DEMO_RE);
  // split with one capture group yields: [text, key, text, key, text, ...]
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      const demo = DEMOS[part];
      return demo ? <Fragment key={i}>{demo()}</Fragment> : null;
    }
    return part ? (
      <div key={i} className="md" dangerouslySetInnerHTML={{ __html: part }} />
    ) : null;
  });
}

export default function Post() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return (
      <div className="fade page">
        <p className="dim">no post found at /blog/{slug}</p>
        <p>
          <Link to="/blog">← back to writing</Link>
        </p>
      </div>
    );
  }

  return (
    <article className="fade page">
      <header className="post-head">
        <p className="post-date">{post.date}</p>
        <h1 className="post-title">{post.title}</h1>
      </header>
      {/* posts are author-trusted markdown rendered at build time */}
      {renderBody(post.html)}
      <p className="post-back">
        <Link to="/blog">← back to writing</Link>
      </p>
    </article>
  );
}
