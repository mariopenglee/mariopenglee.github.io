import './manifold.css';

// All numbers from the post: Cohen's d of each model's coreference chain
// length vs the kids (0 = same as the kids), plus the 2024 means.

const ROWS: [string, number, boolean][] = [
  ['gpt-4 (2024)', 2.2, true],
  ['gpt-4 turbo', 1.85, true],
  ['gpt-5.5', 1.75, true],
  ['gpt-6.1 sol', 0.94, true],
  ['claude haiku 5.5', 0.93, true],
  ['claude opus 5.5', 0.42, false],
  ['claude sonnet 5.5', 0.33, false],
];
const MAX = 2.2;

const mono = { fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--ink-dim)' };

function Bar({ label, value, max, text, faint }: { label: string; value: number; max: number; text: string; faint?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(6.5rem, 9rem) 1fr', gap: '0.6rem', alignItems: 'center', margin: '0.3rem 0', ...mono }}>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid var(--ink-faint)', minHeight: '1rem' }}>
        <div
          style={{
            width: `${(value / max) * 80}%`,
            height: '0.7rem',
            background: faint ? 'transparent' : 'var(--ink)',
            border: faint ? '1px dashed var(--ink-dim)' : 'none',
          }}
        />
        <span style={{ color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{text}</span>
      </div>
    </div>
  );
}

export default function KidsGap() {
  return (
    <div className="mt-demo">
      <div style={{ ...mono, marginBottom: '0.4rem' }}>mentions per character (2024)</div>
      <Bar label="kids" value={5.66} max={5.66} text="5.66" />
      <Bar label="gpt-4" value={3.15} max={5.66} text="3.15" />

      <div style={{ ...mono, margin: '1.2rem 0 0.4rem' }}>gap vs kids, cohen's d (0 = same as the kids)</div>
      {ROWS.map(([name, d, sig]) => (
        <Bar key={name} label={name} value={d} max={MAX} text={sig ? d.toFixed(2) : `${d.toFixed(2)} n.s.`} faint={!sig} />
      ))}

      <p className="mt-readout" style={{ textAlign: 'left' }}>
        the gap shrinks every generation. <span className="mt-hint">dashed = not significant. 31 kids, 30 stories per newer model.</span>
      </p>
    </div>
  );
}
