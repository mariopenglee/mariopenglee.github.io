import { TALKS, ARTICLES } from '../data/site';
import { TalkGrid, WorkSection } from './Home';
import './page.css';

export default function Talks() {
  return (
    <div className="fade page">
      <section className="section">
        <p className="section-title">talks</p>
        <TalkGrid talks={TALKS} />
      </section>
      <WorkSection title="articles" items={ARTICLES} />
    </div>
  );
}
