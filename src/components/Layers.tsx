import './manifold.css';

// A static stacked diagram: one row per layer, a label and a short note.
// Used by talk recaps to redraw a slide's structure in the site's style.
export default function Layers({
  caption,
  rows,
}: {
  caption: string;
  rows: Array<{ label: string; note: string }>;
}) {
  return (
    <figure className="mt-demo" style={{ margin: '2rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(7rem, 11rem) 1fr',
              gap: '0.9rem',
              alignItems: 'baseline',
              padding: '0.6rem 0.8rem',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius)',
              marginLeft: `${i * 0.6}rem`,
            }}
          >
            <code style={{ color: 'var(--ink)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{r.label}</code>
            <span style={{ color: 'var(--ink-dim)', fontSize: '0.8rem' }}>{r.note}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-readout" style={{ fontSize: '0.75rem' }}>
        {caption}
      </figcaption>
    </figure>
  );
}
