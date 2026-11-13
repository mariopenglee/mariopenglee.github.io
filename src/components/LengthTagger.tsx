import { useState } from 'react';
import './manifold.css';

// The exact SLG from the 2022 paper's appendix (trained on the toy corpus3),
// tagged the way the LinearTagging model did it: score every tag sequence
// by I * T * ... * F (minus the last T, see below) and keep the best.
// The words never enter the math.

const INIT: Record<string, number> = { D: 1.0 };
const FINAL: Record<string, number> = { N: 0.8 };
const TRANS: Record<string, [string, number][]> = {
  D: [['N', 0.6], ['Adj', 0.2], ['Adv', 0.2]],
  Adj: [['N', 1.0]],
  Adv: [['Adj', 0.8333333333333334], ['Adv', 0.16666666666666666]],
  N: [['P', 0.2]],
  P: [['D', 1.0]],
};
const MAX_WORDS = 10;

function best(n: number) {
  if (n === 0) return { top: 0, paths: [] as string[][] };
  let top = 0;
  let paths: string[][] = [];
  const walk = (path: string[], p: number) => {
    if (path.length === n) {
      const q = p * (FINAL[path[n - 1]] ?? 0);
      if (q > top + 1e-12) [top, paths] = [q, [path]];
      else if (q > 0 && Math.abs(q - top) <= 1e-12) paths.push(path);
      return;
    }
    // the 2022 Haskell skipped T on the last step (it scored the final tag
    // with F alone), so we do the same to reproduce the paper's outputs
    const last = path.length + 1 === n;
    for (const [t, tp] of TRANS[path[path.length - 1]] ?? []) walk([...path, t], last ? p : p * tp);
  };
  for (const [t, p] of Object.entries(INIT)) walk([t], p);
  return { top, paths };
}

const EXAMPLES = ['the big red dog', 'hello world', 'I like you', 'the cat is under the table'];

export default function LengthTagger() {
  const [text, setText] = useState(EXAMPLES[0]);
  const words = text.trim().split(/\s+/).filter(Boolean).slice(0, MAX_WORDS);
  const { top, paths } = best(words.length);

  return (
    <div className="mt-demo">
      <div className="mt-ctrl">
        <span>type any sentence (up to {MAX_WORDS} words), or pick one from the 2022 paper</span>
        <div className="mt-ctrl-row" style={{ flexWrap: 'wrap' }}>
          <div className="mt-seg" style={{ flexWrap: 'wrap' }}>
            {EXAMPLES.map((s) => (
              <button key={s} className={text === s ? 'on' : ''} onClick={() => setText(s)}>
                {s}
              </button>
            ))}
          </div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            aria-label="sentence to tag"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.85rem',
              width: '100%',
              maxWidth: '22rem',
              padding: '0.3rem 0.5rem',
              background: 'transparent',
              color: 'var(--ink)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius)',
            }}
          />
        </div>
      </div>

      <div className="mt-readout" style={{ textAlign: 'left', lineHeight: 1.9 }}>
        {paths.length ? (
          <>
            {words.map((w, i) => (
              <span key={i} style={{ display: 'inline-block', marginRight: '0.8rem' }}>
                {w}
                <span className="mt-dim">/</span>
                <strong>{paths[0][i]}</strong>
              </span>
            ))}
            <br />
            <span className="mt-hint">
              p = {top.toPrecision(3)}
              {paths.length > 1 && `, tied with ${paths.length - 1} other sequence${paths.length > 2 ? 's' : ''}`}
            </span>
          </>
        ) : words.length === 0 ? (
          <span className="mt-hint">type a sentence</span>
        ) : (
          <span className="mt-hint">
            no tag sequence of length {words.length} can start on D and end on N, so the model has no answer
          </span>
        )}
      </div>
      <p className="mt-hint" style={{ marginTop: '0.6rem' }}>
        change the words but keep the count and the tags don't move. the grammar only has tag-to-tag probabilities.
      </p>
    </div>
  );
}
