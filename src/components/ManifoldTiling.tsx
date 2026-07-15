import { useEffect, useMemo, useRef, useState } from 'react';
import './manifold.css';

// A didactic toy, not a real SAE. It shows the post's mechanism on three
// shapes a real concept might trace (helix, sphere, torus):
//   - each seed shatters the manifold into local atoms, and independent seeds
//     leave gaps in *different* places, so pooling tiles it more fully;
//   - the metric is FEW-ATOM capture (the best B atoms, like the paper's
//     restricted-R^2 over 8 atoms), which is why one very wide SAE can lose to
//     a normal one: it spreads the same sparsity budget over more atoms, so
//     each atom owns a smaller patch, and a few fine patches tile less than a
//     few coarse ones.
// It auto-rotates so coverage gaps spin into view; drag to spin.

type Shape = 'helix' | 'sphere' | 'torus';
type Vec3 = [number, number, number];

const ATOMS_PER_SEED = 6; // = the few-atom budget B, so one seed uses all of them
const BUDGET = ATOMS_PER_SEED;
const HELIX_TURNS = 3;

// distinct-but-muted palette, legible on both themes; only used when
// "color by seed" is on
const SEED_COLORS = ['#e0703a', '#4b9fd6', '#5cb85c', '#c268b4', '#d4b23e'];

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const isSurface = (s: Shape) => s !== 'helix';

interface Pt {
  p: Vec3;
  t: number; // curve parameter (helix only)
}

function manifoldPoints(shape: Shape): Pt[] {
  if (shape === 'helix') {
    const S = 340;
    return Array.from({ length: S + 1 }, (_, i) => {
      const t = i / S;
      const a = 2 * Math.PI * HELIX_TURNS * t;
      return { p: [Math.cos(a), Math.sin(a), (t - 0.5) * 2.4] as Vec3, t };
    });
  }
  if (shape === 'sphere') {
    const N = 520;
    const gold = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: N }, (_, i) => {
      const y = 1 - (2 * i) / (N - 1);
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = gold * i;
      return { p: [Math.cos(th) * r, y, Math.sin(th) * r] as Vec3, t: 0 };
    });
  }
  // torus: grid over the two angles
  const NU = 30, NV = 20, R = 0.68, rr = 0.32;
  const pts: Pt[] = [];
  for (let iu = 0; iu < NU; iu++) {
    for (let iv = 0; iv < NV; iv++) {
      const u = (2 * Math.PI * iu) / NU;
      const v = (2 * Math.PI * iv) / NV;
      pts.push({
        p: [(R + rr * Math.cos(v)) * Math.cos(u), (R + rr * Math.cos(v)) * Math.sin(u), rr * Math.sin(v)],
        t: 0,
      });
    }
  }
  return pts;
}

function randCenter(shape: Shape, rng: () => number): Pt {
  if (shape === 'helix') {
    const t = rng();
    const a = 2 * Math.PI * HELIX_TURNS * t;
    return { p: [Math.cos(a), Math.sin(a), (t - 0.5) * 2.4], t };
  }
  if (shape === 'sphere') {
    const z = 2 * rng() - 1;
    const phi = 2 * Math.PI * rng();
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    return { p: [Math.cos(phi) * r, Math.sin(phi) * r, z], t: 0 };
  }
  const u = 2 * Math.PI * rng(), v = 2 * Math.PI * rng(), R = 0.68, rr = 0.32;
  return { p: [(R + rr * Math.cos(v)) * Math.cos(u), (R + rr * Math.cos(v)) * Math.sin(u), rr * Math.sin(v)], t: 0 };
}

// point indices an atom (center + reach) covers
function coveredBy(shape: Shape, pts: Pt[], c: Pt, reach: number): number[] {
  const out: number[] = [];
  if (shape === 'helix') {
    for (let i = 0; i < pts.length; i++) if (Math.abs(pts[i].t - c.t) <= reach) out.push(i);
  } else {
    const r2 = reach * reach;
    for (let i = 0; i < pts.length; i++) {
      const dx = pts[i].p[0] - c.p[0], dy = pts[i].p[1] - c.p[1], dz = pts[i].p[2] - c.p[2];
      if (dx * dx + dy * dy + dz * dz <= r2) out.push(i);
    }
  }
  return out;
}

interface Atom {
  seed: number; // 0..N-1 for pooled seeds, -1 for the wide control
  cov: number[];
}

// base reach for a normal-width atom, per shape; shrinks as k dilutes
function baseReach(shape: Shape, k: number): number {
  if (shape === 'helix') return 0.16 / k;
  if (shape === 'sphere') return 1.7 / k;
  return 1.5 / k; // torus (euclidean, larger surface)
}

function genAtoms(shape: Shape, pts: Pt[], base: number, seed: number, count: number, reach: number): Atom[] {
  const rng = mulberry32(base * 9301 + (seed + 3) * 2333 + (shape === 'helix' ? 0 : shape === 'sphere' ? 577 : 911));
  return Array.from({ length: count }, () => ({ seed, cov: coveredBy(shape, pts, randCenter(shape, rng), reach) }));
}

interface Panel {
  seedOf: Int16Array; // per point: covering seed, or -2 if uncovered
  capture: number;
}

// greedy few-atom capture: pick the BUDGET atoms that cover the most points
function greedyCapture(atoms: Atom[], P: number): Panel {
  const seedOf = new Int16Array(P).fill(-2);
  let covered = 0;
  for (let b = 0; b < BUDGET; b++) {
    let best = -1, bestGain = 0;
    for (let a = 0; a < atoms.length; a++) {
      let gain = 0;
      const cov = atoms[a].cov;
      for (let j = 0; j < cov.length; j++) if (seedOf[cov[j]] === -2) gain++;
      if (gain > bestGain) { bestGain = gain; best = a; }
    }
    if (best < 0) break;
    const cov = atoms[best].cov;
    for (let j = 0; j < cov.length; j++) if (seedOf[cov[j]] === -2) { seedOf[cov[j]] = atoms[best].seed; covered++; }
  }
  return { seedOf, capture: covered / P };
}

interface Geo {
  pts: Pt[];
  single: Panel;
  pooled: Panel;
  wide: Panel;
}

export default function ManifoldTiling() {
  const [shape, setShape] = useState<Shape>('helix');
  const [k, setK] = useState(5);
  const [seeds, setSeeds] = useState(3);
  const [base, setBase] = useState(1);
  const [bySeed, setBySeed] = useState(false);

  const geo = useMemo<Geo>(() => {
    const pts = manifoldPoints(shape);
    const P = pts.length;
    const r = baseReach(shape, k);
    // one wide SAE spreads the sparsity budget over more atoms, so each owns a
    // finer patch (the shattering); dim=1 for the curve, 2 for the surfaces
    const fine = r / Math.pow(seeds, isSurface(shape) ? 1 / 3 : 1 / 2);

    const seedAtoms: Atom[] = [];
    for (let s = 0; s < seeds; s++) seedAtoms.push(...genAtoms(shape, pts, base, s, ATOMS_PER_SEED, r));
    const singleAtoms = genAtoms(shape, pts, base, 0, ATOMS_PER_SEED, r); // = seed 0
    const wideAtoms = genAtoms(shape, pts, base, -1, ATOMS_PER_SEED * seeds, fine);

    return {
      pts,
      single: greedyCapture(singleAtoms, P),
      pooled: greedyCapture(seedAtoms, P),
      wide: greedyCapture(wideAtoms, P),
    };
  }, [shape, k, seeds, base]);

  const benefit = Math.round((geo.pooled.capture - geo.single.capture) * 100);
  const widePenalty = Math.round((geo.wide.capture - geo.single.capture) * 100);

  const refs = [useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null)];
  const rot = useRef({ yaw: 0.6, pitch: -0.35, dragging: false });
  const bySeedRef = useRef(bySeed);
  bySeedRef.current = bySeed;

  useEffect(() => {
    let raf = 0;
    const draw = (canvas: HTMLCanvasElement, panel: Panel, ink: string, faint: string) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.round((canvas.clientWidth || 1) * dpr);
      if (canvas.width !== size) { canvas.width = size; canvas.height = size; }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      const half = size / 2, scale = half / 1.5;
      const { yaw, pitch } = rot.current;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const color = (s: number) => (bySeedRef.current && s >= 0 ? SEED_COLORS[s % SEED_COLORS.length] : ink);

      const proj = geo.pts.map((pt, i) => {
        const [x, y, z] = pt.p;
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        return { sx: half + x1 * scale, sy: half - y2 * scale, depth: z2, s: panel.seedOf[i], i };
      });

      if (isSurface(shape)) {
        proj.sort((a, b) => a.depth - b.depth);
        for (const q of proj) {
          const d = (q.depth + 1.3) / 2.6, on = q.s > -2;
          ctx.globalAlpha = on ? 0.35 + 0.65 * d : 0.1 + 0.18 * d;
          ctx.fillStyle = on ? color(q.s) : faint;
          const rad = (on ? 2.6 : 1.6) * (0.6 + 0.5 * d) * dpr;
          ctx.beginPath();
          ctx.arc(q.sx, q.sy, rad, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else {
        for (let i = 0; i < proj.length - 1; i++) {
          const a = proj[i], b = proj[i + 1], d = (a.depth + 1.3) / 2.6, on = a.s > -2;
          ctx.globalAlpha = on ? 0.4 + 0.6 * d : 0.1 + 0.16 * d;
          ctx.strokeStyle = on ? color(a.s) : faint;
          ctx.lineWidth = (on ? 3 : 1.2) * dpr;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      const cs = getComputedStyle(document.documentElement);
      const ink = cs.getPropertyValue('--ink').trim() || '#e9e9ec';
      const faint = cs.getPropertyValue('--ink-faint').trim() || '#565760';
      if (!rot.current.dragging) rot.current.yaw += 0.006;
      const panels = [geo.single, geo.pooled, geo.wide];
      refs.forEach((ref, idx) => ref.current && draw(ref.current, panels[idx], ink, faint));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [geo, shape]);

  const drag = useRef({ x: 0, y: 0 });
  const onDown = (e: React.PointerEvent) => {
    rot.current.dragging = true;
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!rot.current.dragging) return;
    rot.current.yaw += (e.clientX - drag.current.x) * 0.01;
    rot.current.pitch = Math.max(-1.4, Math.min(1.4, rot.current.pitch - (e.clientY - drag.current.y) * 0.01));
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => { rot.current.dragging = false; };

  const panels: Array<{ key: number; label: string; pct: number }> = [
    { key: 0, label: '1 seed', pct: geo.single.capture },
    { key: 1, label: `${seeds} pooled`, pct: geo.pooled.capture },
    { key: 2, label: `1 wide SAE (${seeds}×)`, pct: geo.wide.capture },
  ];

  return (
    <div className="mt-demo">
      <div className="mt-panels" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        {panels.map((p) => (
          <figure className="mt-panel" key={p.key}>
            <figcaption className="mt-panel-cap">
              <span>{p.label}</span>
              <span className="mt-pct">{Math.round(p.pct * 100)}%</span>
            </figcaption>
            <canvas ref={refs[p.key]} className="mt-canvas" />
          </figure>
        ))}
      </div>

      <p className="mt-readout">
        pooling <strong>{benefit >= 0 ? '+' : ''}{benefit}%</strong> vs 1 seed
        {' · '}the wide SAE <strong>{widePenalty >= 0 ? '+' : ''}{widePenalty}%</strong>
        {widePenalty < 0 ? ' (finer atoms shatter the manifold)' : ''}
        <span className="mt-hint"> · drag to spin</span>
      </p>

      <div className="mt-controls">
        <label className="mt-ctrl">
          <span>shape</span>
          <div className="mt-seg">
            {(['helix', 'sphere', 'torus'] as Shape[]).map((s) => (
              <button key={s} className={shape === s ? 'on' : ''} onClick={() => setShape(s)}>{s}</button>
            ))}
          </div>
        </label>

        <label className="mt-ctrl">
          <span>sparsity k <span className="mt-dim">(compact &rarr; diluted)</span></span>
          <input type="range" min={1} max={8} value={k} onChange={(e) => setK(+e.target.value)} />
        </label>

        <label className="mt-ctrl">
          <span>seeds pooled <span className="mt-dim">{seeds}</span></span>
          <input type="range" min={1} max={5} value={seeds} onChange={(e) => setSeeds(+e.target.value)} />
        </label>

        <div className="mt-ctrl-row">
          <button className={`mt-toggle ${bySeed ? 'on' : ''}`} onClick={() => setBySeed((v) => !v)}>
            {bySeed ? '■' : '□'} color by seed
          </button>
          <button className="mt-reshuffle" onClick={() => setBase((b) => b + 1)}>reshuffle</button>
        </div>
      </div>
    </div>
  );
}
