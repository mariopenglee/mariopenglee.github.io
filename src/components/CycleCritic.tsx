import { useState } from 'react';
import './manifold.css';

// The post's eval table, change vs base on 200 held-out COCO captions.
// "worse" is drawn to the right for every metric: higher nll is worse,
// lower clipscore is worse. Bars are scaled per metric (the units differ).
const RUNS = [
  { key: 'pure', label: 'lambda=0', sub: 'step 500, pure cycle', vals: [0.14, 1.5, -13.0] },
  { key: 'anchor', label: 'lambda=1', sub: 'step 750, anchored', vals: [-0.22, 0.18, -3.0] },
  { key: 'lora', label: 'lora 0.1', sub: 'step 750, lora lambda=0.1', vals: [-0.11, 0.1, -1.5] },
];

const METRICS = [
  { name: 'pix2struct nll', note: 'the critic it trains against', worseSign: 1 },
  { name: 'blip nll', note: 'a captioner it never saw', worseSign: 1 },
  { name: 'clipscore', note: 'image-text match', worseSign: -1 },
];

const fmt = (v: number) => (v > 0 ? '+' : '') + v.toFixed(Math.abs(v) >= 1 ? 1 : 2);

export default function CycleCritic() {
  const [run, setRun] = useState(0);
  const r = RUNS[run];
  const maxAbs = METRICS.map((_, m) => Math.max(...RUNS.map((x) => Math.abs(x.vals[m]))));
  const critic = r.vals[0] < 0, others = r.vals[1] > 0 && r.vals[2] < 0;

  return (
    <div className="mt-demo">
      <p className="mt-readout" style={{ marginTop: 0 }}>
        caption &rarr; sd unet &rarr; image &rarr; pix2struct &rarr; nll of the caption
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--ink-faint)', margin: '1rem 0 0.4rem' }}>
        <span>&larr; better</span>
        <span>change vs base</span>
        <span>worse &rarr;</span>
      </div>

      {METRICS.map((m, i) => {
        const v = r.vals[i];
        const worse = v * m.worseSign; // >0 means worse
        const w = (Math.abs(v) / maxAbs[i]) * 50;
        return (
          <div key={m.name} style={{ marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--ink-dim)', marginBottom: '0.25rem', gap: '0.5rem' }}>
              <span>{m.name} <span className="mt-dim">{m.note}</span></span>
              <strong style={{ color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{fmt(v)}</strong>
            </div>
            <div style={{ position: 'relative', height: '0.9rem' }}>
              <div style={{ position: 'absolute', left: '50%', top: '-0.15rem', bottom: '-0.15rem', borderLeft: '1px solid var(--line)' }} />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: worse > 0 ? '50%' : `${50 - w}%`,
                  width: `${w}%`,
                  background: worse > 0 ? 'var(--ink)' : 'transparent',
                  border: '1px solid var(--ink)',
                  boxSizing: 'border-box',
                  transition: 'left 0.25s, width 0.25s',
                }}
              />
            </div>
          </div>
        );
      })}

      <p className="mt-readout">
        {r.sub}:{' '}
        <strong>
          {critic && others
            ? 'the critic improves while blip and clip get worse'
            : 'everything gets worse, even the critic'}
        </strong>
      </p>

      <div className="mt-controls" style={{ gridTemplateColumns: '1fr' }}>
        <div className="mt-ctrl">
          <span>run <span className="mt-dim">(numbers from the table above)</span></span>
          <div className="mt-seg">
            {RUNS.map((x, i) => (
              <button key={x.key} className={run === i ? 'on' : ''} onClick={() => setRun(i)}>{x.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
