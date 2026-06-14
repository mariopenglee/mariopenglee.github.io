import { useParams, Link } from 'react-router-dom';
import { getPost } from '../data/posts';
import './page.css';

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
      <div className="md" dangerouslySetInnerHTML={{ __html: post.html }} />
      <p className="post-back">
        <Link to="/blog">← back to writing</Link>
      </p>
    </article>
  );
}
