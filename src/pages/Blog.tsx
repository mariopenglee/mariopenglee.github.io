import { Link } from 'react-router-dom';
import { POSTS } from '../data/posts';
import './page.css';

export default function Blog() {
  return (
    <div className="fade page">
      <header className="hero hero-sub">
        <h1 className="hero-name">writing</h1>
        <p className="hero-role dim">notes on interpretability, training, and agents</p>
      </header>

      {POSTS.length === 0 ? (
        <p className="dim">no posts yet.</p>
      ) : (
        <ul className="post-list">
          {POSTS.map((p) => (
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
      )}
    </div>
  );
}
