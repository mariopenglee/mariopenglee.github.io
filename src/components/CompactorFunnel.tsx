import { useEffect, useRef, useState } from 'react';
import './manifold.css';

// Toy animation, not to scale: context tokens stream through the compactor.
// Of the 15 critical facts, base keeps 10 (67%) and adeline-v2 keeps 12 (80%),
// the eval's FP4 rates. Most other tokens are compressed away.
const COLS = 6;
const ROWS = 10;
const N = COLS * ROWS;
const CRIT = [2, 7, 11, 16, 20, 23, 29, 31, 36, 40, 44, 47, 51, 55, 58];
// survival order: base keeps the first 10, adeline-v2 the first 12
const KEEP_ORDER = [7, 31, 2, 44, 20, 55, 11, 36, 51, 23, 40, 16, 58, 29, 47];
const FILLER_KEPT = [5, 26, 49]; // a little non-critical context survives too
const MODELS = { base: 10, 'adeline-v2': 12 } as const;
type Model = keyof typeof MODELS;

const DUR = 5200;
const W = 420;
const H = 250;
// geometry
const GX = 14; // context grid left
const GY = 34;
const STEP = 17;
const MOUTH_X = 150; // funnel entrance
const EXIT_X = 230; // funnel exit
const MID_Y = 128;
const BOX_X = 280; // summary box
const BOX_Y = 60;

const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export default function CompactorFunnel() {
  const [model, setModel] = useState<Model>('base');
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  // start only once the figure scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setT(1);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const v = Math.min(1, (now - start) / DUR);
      setT(v);
      if (v < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [model, run, visible]);

  const nKeep = MODELS[model];
  const keptCrit = new Set(KEEP_ORDER.slice(0, nKeep));
  const slots = [...KEEP_ORDER.slice(0, nKeep), ...FILLER_KEPT];
  const lostOrder = KEEP_ORDER.slice(nKeep);

  let landed = 0;
  let dropped = 0;
  const tokens = Array.from({ length: N }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x0 = GX + col * STEP;
    const y0 = GY + row * STEP;
    const crit = CRIT.includes(i);
    const slot = slots.indexOf(i);
    const lost = crit && !keptCrit.has(i);
    // stream: tokens leave in reading order
    const d = (i / N) * 0.55;
    const a = ease(clamp((t - d) / 0.18)); // to funnel mouth
    const b = ease(clamp((t - d - 0.18) / 0.12)); // through the funnel
    const c = ease(clamp((t - d - 0.3) / 0.14)); // out to summary or dropped

    const mouthY = lerp(GY, GY + (ROWS - 1) * STEP, row / (ROWS - 1)) * 0.75 + MID_Y * 0.25;
    let x = lerp(x0, MOUTH_X, a);
    let y = lerp(y0, mouthY, a);
    x = lerp(x, EXIT_X - 12, b);
    y = lerp(y, lerp(mouthY, MID_Y, 0.85), b);
    let op = 1;

    if (slot >= 0) {
      const sx = BOX_X + 14 + (slot % 5) * 24;
      const sy = BOX_Y + 18 + Math.floor(slot / 5) * 30;
      x = lerp(x, sx, c);
      y = lerp(y, sy, c);
      if (crit && c >= 1) landed++;
    } else if (lost) {
      const k = lostOrder.indexOf(i);
      x = lerp(x, MOUTH_X + 8 + k * 19, c);
      y = lerp(y, H - 22, c);
      if (c >= 1) dropped++;
    } else {
      // compressed away inside the funnel
      op = 1 - b;
    }
    return { i, x, y, op, crit, lost, filler: !crit && slot >= 0 };
  });

  return (
    <div className="mt-demo" ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        <div className="mt-seg">
          {(Object.keys(MODELS) as Model[]).map((m) => (
            <button key={m} className={model === m ? 'on' : ''} onClick={() => setModel(m)}>
              {m}
            </button>
          ))}
        </div>
        <button className="mt-reshuffle" onClick={() => setRun((r) => r + 1)}>replay</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 560, height: 'auto', display: 'block', margin: '0 auto' }} role="img"
        aria-label={`toy animation: a long context streams through the compactor; ${model} keeps ${nKeep} of 15 critical facts`}>
        <g fontFamily="var(--mono)" fontSize="11" fill="var(--ink-faint)">
          <text x={GX - 4} y="18">context</text>
          <text x={MOUTH_X + 2} y="18">compactor</text>
          <text x={BOX_X} y="18">summary</text>
          {dropped > 0 && <text x={MOUTH_X - 32} y={H - 18}>lost</text>}
        </g>

        {/* ghost of the original context */}
        {Array.from({ length: N }, (_, i) => (
          <rect key={`g${i}`} x={GX + (i % COLS) * STEP - 4} y={GY + Math.floor(i / COLS) * STEP - 4} width="8" height="8"
            fill="none" stroke="var(--line)" />
        ))}

        <polygon points={`${MOUTH_X},${GY - 8} ${EXIT_X},${MID_Y - 14} ${EXIT_X},${MID_Y + 14} ${MOUTH_X},${GY + (ROWS - 1) * STEP + 8}`}
          fill="var(--bg-soft)" stroke="var(--line-strong)" strokeWidth="1.2" />
        <rect x={BOX_X} y={BOX_Y} width={W - BOX_X - 8} height="110" fill="none" stroke="var(--line)" strokeDasharray="3 3" />

        {tokens.map(({ i, x, y, op, crit, lost, filler }) => {
          const size = crit ? 10 : 7;
          return (
            <rect key={i} x={x - size / 2} y={y - size / 2} width={size} height={size}
              fill={crit && !lost ? 'var(--ink)' : crit ? 'none' : 'var(--ink-faint)'}
              stroke={crit ? 'var(--ink)' : 'none'} strokeDasharray={lost ? '2 2' : undefined}
              opacity={crit ? op : op * (filler ? 0.8 : 0.6)} />
          );
        })}
      </svg>

      <p className="mt-readout">
        critical facts kept: <strong>{landed} / 15</strong>
        {dropped > 0 && <> &middot; lost: <strong>{dropped}</strong></>}
      </p>
      <p className="mt-readout" style={{ marginTop: 0 }}>
        <span className="mt-hint">toy animation, not to scale; filled squares are critical facts, kept at the eval's FP4 rates</span>
      </p>
    </div>
  );
}
