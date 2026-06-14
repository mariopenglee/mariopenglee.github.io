import { useState } from 'react';

// privacy-light youtube embed: shows a thumbnail facade and only mounts the
// real iframe once the user clicks play, so the page stays fast and quiet.
export default function TalkCard({
  id,
  title,
  meta,
  poster,
}: {
  id: string;
  title: string;
  meta: string;
  poster?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // prefer a hand-picked frame from the talk; fall back to youtube's thumbnail
  const thumb = poster ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className="talk">
      <div className="talk-frame">
        {playing ? (
          <iframe
            className="talk-embed"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="talk-facade"
            onClick={() => setPlaying(true)}
            aria-label={`play talk: ${title}`}
            style={{ backgroundImage: `url(${thumb})` }}
          >
            <span className="talk-play" aria-hidden="true">
              ▶
            </span>
          </button>
        )}
      </div>
      <div className="talk-info">
        <a
          className="talk-title"
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>
        <span className="talk-meta dim">{meta}</span>
      </div>
    </div>
  );
}
