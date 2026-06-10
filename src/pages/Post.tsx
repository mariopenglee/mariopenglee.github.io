import { useParams, Link } from 'react-router-dom';
import Prompt from '../components/Prompt';
import { getPost } from '../data/posts';
import './page.css';

export default function Post() {
  const { slug = '' } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="fade page">
        <Prompt path="~/blog" cmd={`cat ${slug}.md`} />
        <p className="dim">cat: {slug}.md: No such file or directory</p>
        <p className="post-back">
          <Link to="/blog">‹ cd ~/blog</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="fade page">
      <Prompt path="~/blog" cmd={`cat ${post.slug}.md`} />

      <section className="panel">
        <span className="panel-title"><b>{post.slug}.md</b></span>
        <header className="post-head">
          <h1 className="post-h1">{post.title}</h1>
          <p className="post-meta dim">{post.date}</p>
        </header>
        <article className="md" dangerouslySetInnerHTML={{ __html: post.html }} />
      </section>

      <p className="post-back">
        <Link to="/blog">‹ cd ~/blog</Link>
      </p>
    </div>
  );
}
