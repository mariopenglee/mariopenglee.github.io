import { useState } from 'react';
import './manifold.css';

// Illustrative toy. "from memory" uses the post's survey numbers (30% of male
// names are John, 31% of female names are Mary); the other names and the
// generator's pool are made-up placeholders, not the real database.
const POOL_M = ['Kofi', 'Hiroshi', 'Mateo', 'Arjun', 'Dmitri', 'Tane', 'Yusuf', 'Bao', 'Lior', 'Emeka', 'John', 'Sami'];
const POOL_F = ['Amara', 'Ximena', 'Mei', 'Priya', 'Ngozi', 'Aroha', 'Leila', 'Ingrid', 'Thandi', 'Yuki', 'Mary', 'Noor'];
const MEMORY_M_REST = ['Bill', 'Bob', 'Tom', 'Fred', 'Sam'];
const MEMORY_F_REST = ['Sue', 'Jane', 'Ann', 'Kim', 'Liz'];
const BATCH = 8;

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

function fromMemory(): [string, string] {
  const m = Math.random() < 0.3 ? 'John' : pick(MEMORY_M_REST);
  const f = Math.random() < 0.31 ? 'Mary' : pick(MEMORY_F_REST);
  return [m, f];
}

// uniform pick that never repeats the previous name, like the app
function noRepeat(pool: string[], prev?: string) {
  let n = pick(pool);
  while (n === prev) n = pick(pool);
  return n;
}

interface Side {
  rows: [string, string][];
  total: number;
  john: number;
  mary: number;
}

const empty: Side = { rows: [], total: 0, john: 0, mary: 0 };

function add(side: Side, rows: [string, string][]): Side {
  return {
    rows,
    total: side.total + rows.length,
    john: side.john + rows.filter((r) => r[0] === 'John').length,
    mary: side.mary + rows.filter((r) => r[1] === 'Mary').length,
  };
}

const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);

function Column({ title, side }: { title: string; side: Side }) {
  return (
    <div className="mt-panel">
      <div className="mt-panel-cap">
        <span>{title}</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--ink)', minHeight: `${BATCH * 1.45}em`, lineHeight: 1.45 }}>
        {side.rows.length === 0 && <span className="mt-hint">press draw</span>}
        {side.rows.map(([m, f], i) => (
          <div key={i}>
            <span style={{ color: m === 'John' ? 'var(--ink)' : 'var(--ink-dim)', fontWeight: m === 'John' ? 600 : 400 }}>{m}</span>
            <span className="mt-dim"> thinks </span>
            <span style={{ color: f === 'Mary' ? 'var(--ink)' : 'var(--ink-dim)', fontWeight: f === 'Mary' ? 600 : 400 }}>{f}</span>
            <span className="mt-dim"> left.</span>
          </div>
        ))}
      </div>
      <div className="mt-readout" style={{ textAlign: 'left' }}>
        john <strong>{pct(side.john, side.total)}%</strong> · mary <strong>{pct(side.mary, side.total)}%</strong>
      </div>
    </div>
  );
}

export default function NameDraw() {
  const [mem, setMem] = useState<Side>(empty);
  const [gen, setGen] = useState<Side>(empty);

  const draw = () => {
    setMem((s) => add(s, Array.from({ length: BATCH }, fromMemory)));
    setGen((s) => {
      const rows: [string, string][] = [];
      let pm = s.rows[s.rows.length - 1]?.[0];
      let pf = s.rows[s.rows.length - 1]?.[1];
      for (let i = 0; i < BATCH; i++) {
        pm = noRepeat(POOL_M, pm);
        pf = noRepeat(POOL_F, pf);
        rows.push([pm, pf]);
      }
      return add(s, rows);
    });
  };

  return (
    <div className="mt-demo">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', gap: '1.25rem' }}>
        <Column title="from memory" side={mem} />
        <Column title="random generator" side={gen} />
      </div>
      <div className="mt-controls">
        <div className="mt-ctrl-row">
          <button className="mt-reshuffle" onClick={draw}>
            draw {BATCH} examples
          </button>
          <button className="mt-reshuffle" onClick={() => { setMem(empty); setGen(empty); }}>
            reset
          </button>
        </div>
        <div className="mt-ctrl">
          <span>{mem.total} sentences so far</span>
          <span className="mt-dim">
            illustrative. "from memory" picks John 30% and Mary 31% of the time, the survey rates. the generator draws
            uniformly from a toy pool of 12 per gender (the real one has over 200 names), never twice in a row.
          </span>
        </div>
      </div>
    </div>
  );
}
