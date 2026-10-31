import { useEffect, useRef, useState } from 'react';
import data from '../data/tiling.json';
import './manifold.css';

// Real data, not a toy simulation. Two views of "two seeds, one manifold":
//   sphere: a planted sphere in the toy world, TopK SAEs (width 32) with two
//     seeds; each point is coloured by the latent that fires hardest there.
//     Tile colour follows where the tile sits on the sphere; the one tile
//     that is Hungarian-matched across seeds is drawn in ink.
//   temperature: Llama-3.1-8B layer-28 residual, prompts "It is v degrees
//     outside" for v in -30..60 C. Each seed's tile-only reconstruction on its
//     own top-3 PCs, seed B rotated onto A (orthogonal Procrustes). Each
//     point is coloured by the tile with the highest peak-scaled activation;
//     hue = blind co-firing group, so same-group tiles share a hue across seeds.
// Exported from the soar-2026 runs (tiling_fig.npz, tile_render.npz).

type View = 'sphere' | 'temperature';
type V3 = [number, number, number];

const GROUP_HUE: Record<number, string[]> = {
  308: ['#e0703a', '#f0a070', '#b8501e'],
  127: ['#4b9fd6'],
  114: ['#5cb85c'],
  742: ['#c268b4'],
};

const S = data.sphere;
const TP = data.temperature;

// sphere points, rebuilt from the exported grid
const SPHERE_PTS: V3[] = [];
for (let i = 0; i < S.nz; i++) {
  const z = S.z[i], r = Math.sqrt(Math.max(0, 1 - z * z));
  for (let j = 0; j < S.nlon; j++) {
    const a = (S.lon[j] * Math.PI) / 180;
    SPHERE_PTS.push([r * Math.cos(a), r * Math.sin(a), z]);
  }
}

// display only: 13-value moving average of the per-value centroids, scaled so
// both seeds (same Procrustes frame) fit the panel together
const SMOOTH = (() => {
  const sm = TP.seeds.map((sd) =>
    sd.pts.map((_, i) => {
      const acc = [0, 0, 0];
      let n = 0;
      for (let k = Math.max(0, i - 6); k <= Math.min(sd.pts.length - 1, i + 6); k++, n++)
        for (let d = 0; d < 3; d++) acc[d] += sd.pts[k][d];
      return acc.map((v) => v / n);
    }),
  );
  const m = Math.max(...sm.flat().map((p) => Math.hypot(p[0], p[1], p[2])));
  return sm.map((pts) => pts.map((p) => p.map((v) => (v / m) * 1.6)));
})();

// per seed, colour of each temperature tile (group hue, shade by order in group)
const TEMP_COLORS = TP.seeds.map((sd) => {
  const seen: Record<number, number> = {};
  return sd.tiles.map((t) => {
    const k = seen[t.group] ?? 0;
    seen[t.group] = k + 1;
    const pal = GROUP_HUE[t.group] ?? ['#999'];
    return pal[k % pal.length];
  });
});

function project(p: V3, yaw: number, pitch: number) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  // z-up world: spin around z, then tilt
  const x1 = p[0] * cy - p[1] * sy, y1 = p[0] * sy + p[1] * cy;
  const up = p[2] * cp - y1 * sp, depth = p[2] * sp + y1 * cp;
  return { x: x1, y: up, d: depth };
}

export default function SeedTiling() {
  const [view, setView] = useState<View>('sphere');
  const refs = [useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null)];
  const rot = useRef({ yaw: 0.4, pitch: 0.35, dragging: false });

  useEffect(() => {
    let raf = 0;
    const draw = (canvas: HTMLCanvasElement, seed: number, ink: string, faint: string) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.round((canvas.clientWidth || 1) * dpr);
      if (canvas.width !== size) { canvas.width = size; canvas.height = size; }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      const half = size / 2, scale = half / 1.25;
      const { yaw, pitch } = rot.current;

      if (view === 'sphere') {
        const sd = S.seeds[seed];
        const cols = sd.tiles.map((t) => (t.shared ? ink : t.color));
        const px = Math.max(2, size / 62);
        for (let i = 0; i < SPHERE_PTS.length; i++) {
          const q = project(SPHERE_PTS[i], yaw, pitch);
          if (q.d < 0) continue; // back face hidden
          ctx.globalAlpha = 0.45 + 0.55 * q.d;
          ctx.fillStyle = cols[sd.lab.charCodeAt(i) - 97];
          ctx.fillRect(half + q.x * scale - px / 2, half - q.y * scale - px / 2, px, px);
        }
      } else {
        const curve = (pts: number[][], colorAt: (i: number) => string, w: number, alpha: number) => {
          const P = pts.map((p) => project([p[0], p[1], p[2]], yaw, pitch));
          for (let i = 0; i < P.length - 1; i++) {
            ctx.globalAlpha = alpha * (0.55 + 0.45 * (P[i].d + 1) / 2);
            ctx.strokeStyle = colorAt(i);
            ctx.lineWidth = w * dpr;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(half + P[i].x * scale, half - P[i].y * scale);
            ctx.lineTo(half + P[i + 1].x * scale, half - P[i + 1].y * scale);
            ctx.stroke();
          }
          return P;
        };
        // other seed's curve as a faint ghost (already in the same frame)
        curve(SMOOTH[1 - seed], () => faint, 1.2, 0.8);
        const sd = TP.seeds[seed];
        const P = curve(SMOOTH[seed], (i) => TEMP_COLORS[seed][sd.win[i]], 4, 1);
        ctx.globalAlpha = 1;
        ctx.fillStyle = ink;
        ctx.font = `${11 * dpr}px "IBM Plex Mono", monospace`;
        const last = P.length - 1;
        ctx.fillText('-30°C', half + P[0].x * scale + 6 * dpr, half - P[0].y * scale);
        ctx.fillText('60°C', half + P[last].x * scale + 6 * dpr, half - P[last].y * scale);
      }
      ctx.globalAlpha = 1;
    };
    const loop = () => {
      const cs = getComputedStyle(document.documentElement);
      const ink = cs.getPropertyValue('--ink').trim() || '#e9e9ec';
      const faint = cs.getPropertyValue('--ink-faint').trim() || '#565760';
      if (!rot.current.dragging) rot.current.yaw += 0.005;
      refs.forEach((r, s) => r.current && draw(r.current, s, ink, faint));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [view]);

  const drag = useRef({ x: 0, y: 0 });
  const onDown = (e: React.PointerEvent) => {
    rot.current.dragging = true;
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!rot.current.dragging) return;
    rot.current.yaw += (e.clientX - drag.current.x) * 0.01;
    rot.current.pitch = Math.max(-1.4, Math.min(1.4, rot.current.pitch + (e.clientY - drag.current.y) * 0.01));
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => { rot.current.dragging = false; };

  const caps =
    view === 'sphere'
      ? S.seeds.map((sd, s) => ({ label: `seed ${'AB'[s]}`, n: `${sd.tiles.length} tiles` }))
      : TP.seeds.map((sd, s) => ({ label: `seed ${'AB'[s]}`, n: `${sd.tiles.length} tiles` }));

  return (
    <div className="mt-demo">
      <div className="mt-controls" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', marginBottom: '1rem' }}>
        <div className="mt-seg">
          {(['sphere', 'temperature'] as View[]).map((v) => (
            <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>
              {v === 'sphere' ? 'toy sphere' : 'llama temperature'}
            </button>
          ))}
        </div>
      </div>
      <div
        className="mt-panels"
        style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {caps.map((c, s) => (
          <figure className="mt-panel" key={s}>
            <figcaption className="mt-panel-cap">
              <span>{c.label}</span>
              <span className="mt-pct">{c.n}</span>
            </figcaption>
            <canvas ref={refs[s]} className="mt-canvas" />
          </figure>
        ))}
      </div>
      <p className="mt-readout">
        {view === 'sphere' ? (
          <>
            same sphere, <strong>9</strong> vs <strong>6</strong> tiles, <strong>1</strong> matched one-to-one (ink)
          </>
        ) : (
          <>
            <strong>0</strong> tiles matched one-to-one, yet the curves align (R² <strong>{TP.r2.toFixed(2)}</strong>); grey = the other seed
          </>
        )}
        <span className="mt-hint"> · drag to spin</span>
      </p>
      {view === 'temperature' && (
        <p className="mt-readout" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
          color = blind co-firing group: orange holds B's two end tiles and three of A's four (A splits each end in two), blue the 3°C tile
        </p>
      )}
    </div>
  );
}
