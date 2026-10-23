import { useState } from 'react';
import './manifold.css';

// Reversed rate on rare prompts for every intervention in the post.
// A range is drawn as a span (lo..hi); a single number as a thin span.
const ROWS = [
  { label: 'sdxl', group: 'clip', lo: 0.74, hi: 0.74, note: 'baseline: two clip encoders, role-blind noun tokens (probe at 0.50)' },
  { label: 'sd3.5-large', group: 'clip', lo: 0.72, hi: 0.75, note: 't5 alongside clip, and t5 decodes the role at about 1.00, yet no better' },
  { label: 'sd3.5, t5 only', group: 'clip', lo: 0.45, hi: 0.57, note: 'lower, but almost all of it moves to "neither"; correct goes up only about 4 points' },
  { label: 'sdxl, cfg 3 / 7 / 12', group: 'guidance', lo: 0.68, hi: 0.74, note: 'stronger guidance changes the pictures, not who is doing what' },
  { label: 'sdxl, passive voice', group: 'guidance', lo: 0.78, hi: 0.78, note: "rewording the prompt doesn't help either" },
  { label: 'itercomp', group: 'guidance', lo: 0.76, hi: 0.76, note: 'a fine-tune trained for composition, same result' },
];

const pct = (v: number) => Math.round(v * 100);

export default function RoleCollapseRates() {
  const [sel, setSel] = useState(0);
  return (
    <div className="mt-demo">
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--ink-faint)', marginBottom: '0.6rem' }}>
        <span>rare prompts, reversed rate</span>
        <span>0 &middot; 50 &middot; 100%</span>
      </div>

      {ROWS.map((r, i) => {
        const on = sel === i;
        const thin = r.hi - r.lo < 0.01;
        return (
          <button
            key={r.label}
            onClick={() => setSel(i)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              padding: '0.3rem 0',
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
              fontSize: '0.78rem',
              color: on ? 'var(--ink)' : 'var(--ink-dim)',
            }}
          >
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span>{r.label} <span className="mt-dim">{r.group}</span></span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{thin ? pct(r.lo) : `${pct(r.lo)}-${pct(r.hi)}`}%</span>
            </span>
            <span style={{ position: 'relative', display: 'block', height: '0.7rem', borderBottom: '1px solid var(--line)' }}>
              <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dashed var(--line)' }} />
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: `${r.lo * 100}%`,
                  background: on ? 'var(--ink)' : 'var(--ink-faint)',
                }}
              />
              {!thin && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${r.lo * 100}%`,
                    width: `${(r.hi - r.lo) * 100}%`,
                    border: `1px solid ${on ? 'var(--ink)' : 'var(--ink-faint)'}`,
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </span>
          </button>
        );
      })}

      <p className="mt-readout">
        <strong>{ROWS[sel].label}</strong>: {ROWS[sel].note}
      </p>
      <p className="mt-readout" style={{ marginTop: 0 }}>
        <span className="mt-hint">outlined part is a range across runs &middot; tap a row</span>
      </p>
    </div>
  );
}
