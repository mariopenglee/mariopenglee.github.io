import { useState, type CSSProperties } from 'react';
import './manifold.css';

// Illustrative toy, not real heartbeat data. Steps a made-up event stream
// through a plain-text user model: most events change nothing, some land as a
// diff, and one contradicts an old belief and surfaces as a merge conflict.

type Mark = ' ' | '+' | '-' | '!';
interface Step {
  event: string;
  note: string;
  lines: [Mark, string][];
  commit?: string;
}

const BASE: [Mark, string][] = [
  [' ', '# user.md'],
  [' ', 'role: ml engineer'],
  [' ', 'working on: eval pipeline'],
  [' ', 'prefers: python for prototypes'],
];

const STEPS: Step[] = [
  { event: '(start)', note: 'current belief state, plain text', lines: BASE },
  {
    event: 'calendar: weekly standup, same as always',
    note: 'no diff: it would not act differently, so it is ignored',
    lines: BASE,
  },
  {
    event: 'doc: starts drafting a conference talk',
    note: 'one new fact worth keeping, committed as a diff',
    lines: [...BASE, ['+', 'working on: talk draft, due soon']],
    commit: 'add talk draft to current work',
  },
  {
    event: 'chat: "rewriting the prototype in rust"',
    note: 'new evidence contradicts an old belief: a merge conflict',
    lines: [
      ...BASE.slice(0, 3),
      ['!', '<<<<<<< belief'],
      ['!', 'prefers: python for prototypes'],
      ['!', '======='],
      ['!', 'prefers: rust for this prototype'],
      ['!', '>>>>>>> evidence'],
      [' ', 'working on: talk draft, due soon'],
    ],
  },
  {
    event: '(resolve)',
    note: 'resolved explicitly instead of silently overwritten',
    lines: [
      ...BASE.slice(0, 3),
      ['-', 'prefers: python for prototypes'],
      ['+', 'prefers: python usually, rust for this prototype'],
      [' ', 'working on: talk draft, due soon'],
    ],
    commit: 'reconcile language preference',
  },
];

const markStyle = (m: Mark): CSSProperties =>
  m === '+' ? { color: 'var(--ink)', fontWeight: 600 }
  : m === '-' ? { color: 'var(--ink-faint)', textDecoration: 'line-through' }
  : m === '!' ? { color: 'var(--ink)', background: 'var(--line)' }
  : { color: 'var(--ink-dim)' };

export default function BeliefRepo() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const log = STEPS.slice(0, i + 1).filter((x) => x.commit).reverse();

  return (
    <div className="mt-demo">
      <p className="mt-panel-cap" style={{ whiteSpace: 'normal' }}>
        <span>event {i}/{STEPS.length - 1}: {s.event}</span>
      </p>
      <pre style={{ margin: '0.4rem 0 0', minHeight: '11em', whiteSpace: 'pre-wrap' }}>
        <code>
          {s.lines.map(([m, t], k) => (
            <div key={k} style={markStyle(m)}>
              {m === '!' ? ' ' : m} {t}
            </div>
          ))}
        </code>
      </pre>
      <p className="mt-readout">{s.note}</p>
      <pre style={{ margin: '0.75rem 0 0', minHeight: '4.2em' }}>
        <code>
          <div style={{ color: 'var(--ink-faint)' }}>$ git log --oneline</div>
          {log.length === 0 && <div style={{ color: 'var(--ink-faint)' }}>(no commits yet)</div>}
          {log.map((x) => (
            <div key={x.commit} style={{ color: 'var(--ink-dim)' }}>{x.commit}</div>
          ))}
        </code>
      </pre>
      <div className="mt-controls">
        <div className="mt-ctrl-row">
          <button className="mt-reshuffle" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
            prev
          </button>
          <button className="mt-reshuffle" onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))} disabled={i === STEPS.length - 1}>
            next event
          </button>
        </div>
        <span className="mt-ctrl"><span className="mt-dim">illustrative toy, made-up events</span></span>
      </div>
    </div>
  );
}
