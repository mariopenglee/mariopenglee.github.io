import { useState } from 'react';
import './manifold.css';

// Critical facts kept (fraction), base vs adeline-v2, paired on the same packs.
const RETENTION = [
  { label: 'unseen repos, bf16', base: 0.698, v2: 0.804, note: 'unseen repos, 88.5% vs 87.7% of tokens removed: +0.106 [0.075, 0.133]' },
  { label: 'unseen repos, FP4', base: 0.673, v2: 0.802, note: 'same sessions, both models quantized to FP4: +0.129 [0.085, 0.167]' },
];

// Validation loss at the end of each run of the learning curve (nested subsets).
const CURVE = [
  { label: '25%', loss: 0.5528 },
  { label: '50%', loss: 0.5318 },
  { label: '100%', loss: 0.513 },
];

const LO = 0.5;
const HI = 0.56;

export default function AdelineRetention() {
  const [view, setView] = useState<'ret' | 'curve'>('ret');
  const [sel, setSel] = useState(0);
  const mono = { fontFamily: 'var(--mono)', fontSize: '0.78rem' } as const;

  return (
    <div className="mt-demo">
      <div className="mt-seg" style={{ marginBottom: '0.9rem' }}>
        <button className={view === 'ret' ? 'on' : ''} onClick={() => setView('ret')}>retention</button>
        <button className={view === 'curve' ? 'on' : ''} onClick={() => setView('curve')}>loss curve</button>
      </div>

      {view === 'ret' ? (
        <>
          {RETENTION.map((r, i) => {
            const on = sel === i;
            return (
              <button
                key={r.label}
                onClick={() => setSel(i)}
                style={{ ...mono, display: 'block', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '0.35rem 0', cursor: 'pointer', color: on ? 'var(--ink)' : 'var(--ink-dim)' }}
              >
                <span style={{ display: 'block', marginBottom: '0.25rem' }}>{r.label}</span>
                {([['base', r.base, 'var(--ink-faint)'], ['v2', r.v2, on ? 'var(--ink)' : 'var(--ink-dim)']] as const).map(([k, v, c]) => (
                  <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                    <span style={{ width: '2.2rem', color: 'var(--ink-faint)' }}>{k}</span>
                    <span style={{ flex: 1, position: 'relative', height: '0.6rem', borderBottom: '1px solid var(--line)' }}>
                      <span style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${v * 100}%`, background: c }} />
                    </span>
                    <span style={{ width: '2.6rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(v * 1000) / 10}%</span>
                  </span>
                ))}
              </button>
            );
          })}
          <p className="mt-readout">{RETENTION[sel].note}</p>
          <p className="mt-readout" style={{ marginTop: 0 }}><span className="mt-hint">tap a row</span></p>
        </>
      ) : (
        <>
          {CURVE.map((c) => (
            <div key={c.label} style={{ ...mono, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0', color: 'var(--ink-dim)' }}>
              <span style={{ width: '6.5rem' }}>{c.label} <span className="mt-dim">subset</span></span>
              <span style={{ flex: 1, position: 'relative', height: '0.6rem', borderBottom: '1px solid var(--line)' }}>
                <span style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${((c.loss - LO) / (HI - LO)) * 100}%`, background: 'var(--ink-dim)' }} />
              </span>
              <span style={{ width: '3rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--ink)' }}>{c.loss.toFixed(3)}</span>
            </div>
          ))}
          <p className="mt-readout">validation loss on nested subsets of the learning-curve data</p>
          <p className="mt-readout" style={{ marginTop: 0 }}><span className="mt-hint">axis starts at {LO}, so the drop looks bigger than it is</span></p>
        </>
      )}
    </div>
  );
}
