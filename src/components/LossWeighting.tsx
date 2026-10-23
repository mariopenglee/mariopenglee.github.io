import { useState } from 'react';
import './manifold.css';

// Illustrative toy, not the MovieLens results. Two task gradients that
// partly conflict. With a shared backbone the parameters move along the
// weighted sum, so each task only gets the component of that sum along its
// own gradient, and a lopsided weighting can push the other task backwards.
// Without sharing each head just follows its own (weighted) gradient.

const WEIGHTS: Array<{ key: string; a: number; b: number }> = [
  { key: '0.99 / 0.1', a: 0.99, b: 0.1 },
  { key: '0.5 / 0.5', a: 0.5, b: 0.5 },
];

const S = 70; // px per unit
const C = 110; // svg center

function Arrow({ x, y, dim, bold }: { x: number; y: number; dim?: boolean; bold?: boolean }) {
  const ex = C + x * S, ey = C - y * S;
  const len = Math.hypot(x, y) || 1;
  const ux = x / len, uy = -y / len, h = 7;
  const color = dim ? 'var(--ink-faint)' : 'var(--ink)';
  return (
    <g style={{ stroke: color, fill: color }}>
      <line x1={C} y1={C} x2={ex} y2={ey} strokeWidth={bold ? 2.5 : 1.5} strokeDasharray={dim ? '4 3' : undefined} />
      {len > 0.05 && (
        <polygon
          points={`${ex},${ey} ${ex - ux * h - uy * h * 0.5},${ey - uy * h + ux * h * 0.5} ${ex - ux * h + uy * h * 0.5},${ey - uy * h - ux * h * 0.5}`}
          style={{ stroke: 'none' }}
        />
      )}
    </g>
  );
}

export default function LossWeighting() {
  const [w, setW] = useState(0);
  const [shared, setShared] = useState(true);
  const [angle, setAngle] = useState(120);

  const { a, b } = WEIGHTS[w];
  const th = (angle * Math.PI) / 180;
  const gA = [1, 0];
  const gB = [Math.cos(th), Math.sin(th)];
  const u = [a * gA[0] + b * gB[0], a * gA[1] + b * gB[1]];
  // progress = step projected onto each task's own gradient direction
  const progA = shared ? u[0] * gA[0] + u[1] * gA[1] : a;
  const progB = shared ? u[0] * gB[0] + u[1] * gB[1] : b;
  const fmt = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}`;

  const label = (x: number, y: number, text: string) => (
    <text x={C + x * S * 1.18} y={C - y * S * 1.18 + 4} textAnchor="middle" style={{ fill: 'var(--ink-dim)', fontFamily: 'var(--mono)', fontSize: 11 }}>
      {text}
    </text>
  );

  return (
    <div className="mt-demo">
      <svg viewBox="0 0 220 220" style={{ width: '100%', maxWidth: 280, display: 'block', margin: '0 auto' }}>
        <circle cx={C} cy={C} r={S} style={{ fill: 'none', stroke: 'var(--line)' }} />
        <Arrow x={gA[0]} y={gA[1]} dim />
        <Arrow x={gB[0]} y={gB[1]} dim />
        {label(gA[0], gA[1], 'engage')}
        {label(gB[0], gB[1], 'rating')}
        {shared ? (
          <Arrow x={u[0]} y={u[1]} bold />
        ) : (
          <>
            <Arrow x={a * gA[0]} y={a * gA[1]} bold />
            <Arrow x={b * gB[0]} y={b * gB[1]} bold />
          </>
        )}
      </svg>

      <p className="mt-readout">
        progress: engage <strong>{fmt(progA)}</strong> &middot; rating <strong>{fmt(progB)}</strong>
        {progB < 0 ? ' (the rating head goes backwards)' : ''}
        <br />
        <span className="mt-hint">
          dashed: each task's own gradient &middot; solid: the update {shared ? 'the shared layers actually take' : 'each separate head takes'} &middot; illustrative
        </span>
      </p>

      <div className="mt-controls">
        <label className="mt-ctrl">
          <span>loss weights <span className="mt-dim">(engage / rating)</span></span>
          <div className="mt-seg">
            {WEIGHTS.map((o, i) => (
              <button key={o.key} className={w === i ? 'on' : ''} onClick={() => setW(i)}>{o.key}</button>
            ))}
          </div>
        </label>
        <label className="mt-ctrl">
          <span>parameter sharing</span>
          <div className="mt-seg">
            <button className={shared ? 'on' : ''} onClick={() => setShared(true)}>on</button>
            <button className={!shared ? 'on' : ''} onClick={() => setShared(false)}>off</button>
          </div>
        </label>
        <label className="mt-ctrl">
          <span>gradient conflict <span className="mt-dim">{angle}&deg; apart</span></span>
          <input type="range" min={20} max={180} step={5} value={angle} onChange={(e) => setAngle(+e.target.value)} />
        </label>
      </div>
    </div>
  );
}
