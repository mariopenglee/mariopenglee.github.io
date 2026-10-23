import { useState } from 'react';
import './manifold.css';

// Illustrative, not logged model outputs: the three IOI circuit steps run on a
// clean prompt, then on the perturbations from the post, marking where the
// routine slips. Outcomes are the qualitative trends the post describes.

type Key = 'clean' | 'rare' | 'self';

interface Case {
  label: string;
  before: string; // text before the names
  a: string; // repeated name (subject)
  b: string; // the indirect object
  mid: string;
  end: string;
  steps: [string, boolean][]; // step text, holds?
  outcome: string;
}

const CASES: Record<Key, Case> = {
  clean: {
    label: 'clean',
    before: 'When', a: 'John', b: 'Mary', mid: 'went to the store,', end: 'gave a drink to',
    steps: [
      ['find the duplicated name: John', true],
      ['suppress it', true],
      ['copy the other name: Mary', true],
    ],
    outcome: 'answers Mary. the routine works on the sentences it was measured on.',
  },
  rare: {
    label: 'rare name',
    before: 'When', a: 'John', b: 'Zubair', mid: 'went to the store,', end: 'gave a drink to',
    steps: [
      ['find the duplicated name: John', true],
      ['suppress it', true],
      ['copy the other name: Zubair (a rare token, weak pull)', false],
    ],
    outcome: 'wobbles. name priors beat the syntax, and common names win arguments they shouldn\'t.',
  },
  self: {
    label: 'self as object',
    before: 'When', a: 'Josh', b: 'Mary', mid: 'went to the store,', end: 'went with',
    steps: [
      ['find the duplicated name: Josh', true],
      ['suppress it (only partly)', false],
      ['copy the other name: Mary', false],
    ],
    outcome: 'gpt-2 small will happily say Josh. the gpt-neo models mostly learned to punish this.',
  },
};

const tokStyle = (kind: 'dup' | 'io') => ({
  padding: '0 0.2em',
  borderRadius: 2,
  color: 'var(--ink)',
  border: kind === 'io' ? '1px solid var(--ink)' : '1px dashed var(--ink-faint)',
});

export default function IoiPerturb() {
  const [k, setK] = useState<Key>('clean');
  const c = CASES[k];
  const broken = c.steps.some(([, ok]) => !ok);
  const name = (n: string, kind: 'dup' | 'io') => <span style={tokStyle(kind)}>{n}</span>;

  return (
    <div className="mt-demo">
      <div className="mt-controls" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
        <label className="mt-ctrl">
          <span>move the prey</span>
          <div className="mt-seg" style={{ flexWrap: 'wrap' }}>
            {(Object.keys(CASES) as Key[]).map((key) => (
              <button key={key} className={k === key ? 'on' : ''} onClick={() => setK(key)}>
                {CASES[key].label}
              </button>
            ))}
          </div>
        </label>
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', lineHeight: 1.9, margin: '1rem 0', color: 'var(--ink-dim)' }}>
        {c.before} {name(c.a, 'dup')} and {name(c.b, 'io')} {c.mid} {name(c.a, 'dup')} {c.end}{' '}
        <span style={{ color: 'var(--ink-faint)' }}>___</span>
      </p>

      <ol style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', margin: 0, paddingLeft: '1.4rem', color: 'var(--ink-dim)' }}>
        {c.steps.map(([text, ok]) => (
          <li key={text} style={{ margin: '0.25rem 0', color: ok ? 'var(--ink-dim)' : 'var(--ink)' }}>
            {text} <span style={{ color: ok ? 'var(--ink-faint)' : 'var(--ink)' }}>[{ok ? 'holds' : 'slips'}]</span>
          </li>
        ))}
      </ol>

      <p className="mt-readout" style={{ textAlign: 'left' }}>
        <strong>{broken ? 'routine breaks' : 'routine holds'}</strong>: {c.outcome}
      </p>
      <p className="mt-readout mt-hint" style={{ textAlign: 'left', fontSize: '0.72rem', margin: '0.5rem 0 0' }}>
        illustrative: steps from the Wang et al. circuit, outcomes are the qualitative trends above, not logged outputs.
        dashed = repeated name, solid = indirect object.
      </p>
    </div>
  );
}
