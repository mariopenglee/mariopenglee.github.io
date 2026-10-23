import { useEffect, useState } from 'react';
import './manifold.css';

// The post's terminal block, typing itself out. Commands type char by char,
// output lines appear whole, like a real shell.
const LINES: { cmd: boolean; text: string }[] = [
  { cmd: true, text: 'whoami' },
  { cmd: false, text: 'mario peng lee, AI Engineer' },
  { cmd: true, text: 'cat thoughts/ | tee blog/' },
];

// a command costs its length + 1 (the enter), an output line costs 1
const FULL = LINES.reduce((n, l) => n + (l.cmd ? l.text.length + 1 : 1), 0);

function reducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export default function TerminalTyping() {
  const [tick, setTick] = useState(() => (reducedMotion() ? FULL : 0));
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reducedMotion()) return;
    setTick(0);
    const id = window.setInterval(() => {
      setTick((t) => {
        if (t + 1 >= FULL) window.clearInterval(id);
        return Math.min(t + 1, FULL);
      });
    }, 70);
    return () => window.clearInterval(id);
  }, [run]);

  let left = tick;
  const shown: string[] = [];
  for (const l of LINES) {
    if (l.cmd) {
      if (left < 0) break;
      shown.push('$ ' + l.text.slice(0, left));
      left -= l.text.length + 1;
    } else {
      if (left <= 0) break;
      shown.push(l.text);
      left -= 1;
    }
  }
  const done = tick >= FULL;
  if (done) shown.push('$ ');

  return (
    <div className="mt-demo">
      <pre style={{ margin: 0, minHeight: '7.5em' }} aria-label={LINES.map((l) => (l.cmd ? '$ ' : '') + l.text).join('\n')}>
        <code>
          {shown.join('\n')}
          <span className="tt-cursor">{'█'}</span>
        </code>
      </pre>
      <div className="mt-ctrl-row" style={{ marginTop: '0.75rem' }}>
        <button className="mt-reshuffle" onClick={() => setRun((r) => r + 1)} disabled={!done}>
          replay
        </button>
      </div>
      <style>{`
        .tt-cursor { color: var(--ink-dim); animation: tt-blink 1s steps(1) infinite; }
        @keyframes tt-blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .tt-cursor { animation: none; } }
      `}</style>
    </div>
  );
}
