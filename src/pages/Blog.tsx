import { Link } from 'react-router-dom';
import Prompt from '../components/Prompt';
import { POSTS } from '../data/posts';
import './page.css';

export default function Blog() {
  return (
    <div className="fade page">
      <Prompt path="~/blog" cmd="ls -la" />

      <section className="panel">
        <span className="panel-title">
          <b>posts/</b> ({POSTS.length})
        </span>
        {POSTS.length === 0 ? (
          <p className="dim">no posts yet — check back soon.</p>
        ) : (
          <ul className="post-list stagger">
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
      </section>
    </div>
  );
}
