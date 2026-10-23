import { useEffect, useMemo, useState } from 'react';
import './manifold.css';

// Illustrative toy of the post's core move: a block-autoregressive model
// generates blocks left to right (so log pi is an exact chain rule across
// blocks) and denoises in arbitrary order inside each block (so only the
// within-block term needs an estimate like the ELBO). Block size 1 is plain
// autoregressive; block size = N is pure diffusion.

const N = 24;
const SIZES: Array<{ b: number; label: string }> = [
  { b: 1, label: 'ar' },
  { b: 4, label: 'block 4' },
  { b: 8, label: 'block 8' },
  { b: N, label: 'diffusion' },
];

// fixed pseudo-random reveal order inside each block
function revealOrder(b: number): number[] {
  const order: number[] = [];
  for (let s = 0; s < N; s += b) {
    const idx = Array.from({ length: b }, (_, i) => s + i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = (i * 7 + s * 3 + 5) % (i + 1);
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    order.push(...idx);
  }
  return order;
}

const cell = (on: boolean, active: boolean): React.CSSProperties => ({
  width: '0.9rem',
  height: '0.9rem',
  borderRadius: 2,
  background: on ? 'var(--ink)' : 'transparent',
  border: `1px ${on ? 'solid' : 'dashed'} ${on ? 'var(--ink)' : active ? 'var(--ink-dim)' : 'var(--ink-faint)'}`,
  transition: 'background 120ms',
});

export default function BlockFactorization() {
  const [b, setB] = useState(4);
  const [t, setT] = useState(0);
  const order = useMemo(() => revealOrder(b), [b]);

  useEffect(() => {
    setT(0);
    const id = setInterval(() => setT((x) => (x >= N + 6 ? 0 : x + 1)), 160);
    return () => clearInterval(id);
  }, [b]);

  const revealed = new Set(order.slice(0, Math.min(t, N)));
  const activeBlock = t < N ? Math.floor(order[t] / b) : -1;
  const blocks = Array.from({ length: N / b }, (_, k) => k);

  const readout =
    b === 1
      ? `${N} blocks of 1 token: every term is an exact next-token log-prob (plain autoregressive)`
      : b === N
        ? `1 block of ${N} tokens: the whole sequence needs the estimate (pure diffusion)`
        : `${N / b} blocks: exact chain rule across them, only ${b} tokens at a time need the estimate`;

  return (
    <div className="mt-demo">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
        {blocks.map((k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {k > 0 && <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--ink-dim)' }}>&rarr;</span>}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                padding: 4,
                border: `1px solid ${k === activeBlock ? 'var(--line-strong)' : 'var(--line)'}`,
                borderRadius: 'var(--radius)',
                maxWidth: b === N ? '100%' : undefined,
                justifyContent: 'center',
              }}
            >
              {Array.from({ length: b }, (_, i) => k * b + i).map((p) => (
                <div key={p} style={cell(revealed.has(p), k === activeBlock)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-readout" style={{ fontSize: '0.8rem' }}>
        log &pi;(x) = <strong>&Sigma;</strong>
        <sub>blocks</sub> log p(block | earlier blocks)
        <br />
        <span className="mt-dim">
          &rarr; exact (chain rule) &middot; inside a box: denoised in any order, so &asymp; (elbo / quadrature)
        </span>
      </p>
      <p className="mt-readout" style={{ marginTop: '0.5rem' }}>
        <strong>{readout}</strong>
      </p>

      <div className="mt-controls">
        <label className="mt-ctrl">
          <span>block size <span className="mt-dim">({N} tokens, illustrative)</span></span>
          <div className="mt-seg">
            {SIZES.map((s) => (
              <button key={s.b} className={b === s.b ? 'on' : ''} onClick={() => setB(s.b)}>
                {s.label}
              </button>
            ))}
          </div>
        </label>
      </div>
    </div>
  );
}
