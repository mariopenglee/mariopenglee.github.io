import { useState } from 'react';
import './manifold.css';

// Two parts: the real model outputs from the post's table, and a hand-written
// rule stand-in (NOT the model) for words the reader types in. The rule is the
// one in the post: plural is /s/ after a voiceless sound, /z/ after a voiced one.
const MODEL: Record<string, [string, string, string]> = {
  wuks: ['[wəks]', '[wəks]', '[wəks]'],
  wugs: ['[wəgz]', '[wəgz]', '[wəgz]'],
  musips: ['[məsəps]', '[mjuzɪps]', '[mjuzɪps]'],
};
const SIZES = ['t5-small', 't5-base', 't5-large'];

// spelling-level approximation of voicing for the sound before the plural s
const VOICELESS = new Set(['p', 't', 'k', 'f']);
const SIBILANT_ENDS = ['ses', 'zes', 'xes', 'ches', 'shes'];

interface Rule { stem: string; before: string; tail: string; voiced: string; ending: string }

function rule(word: string): Rule | null {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length < 2 || !w.endsWith('s')) return null;
  const sib = SIBILANT_ENDS.find((e) => w.endsWith(e));
  if (sib) {
    const before = sib.slice(0, -2);
    return { stem: w.slice(0, w.length - sib.length), before, tail: 'es', voiced: 'sibilant', ending: '/ɪz/' };
  }
  const before = w.endsWith('ths') ? 'th' : w[w.length - 2];
  const unvoiced = VOICELESS.has(before) || before === 'th';
  return {
    stem: w.slice(0, w.length - before.length - 1),
    before,
    tail: 's',
    voiced: unvoiced ? 'voiceless' : 'voiced',
    ending: unvoiced ? '/s/' : '/z/',
  };
}

export default function WugTest() {
  const [word, setWord] = useState('wugs');
  const model = MODEL[word.toLowerCase()];
  const r = rule(word);

  return (
    <div className="mt-demo">
      <div className="mt-ctrl">
        <span>pick a test word, or type your own plural</span>
        <div className="mt-ctrl-row" style={{ flexWrap: 'wrap' }}>
          <div className="mt-seg">
            {Object.keys(MODEL).map((w) => (
              <button key={w} className={word === w ? 'on' : ''} onClick={() => setWord(w)}>
                {w}
              </button>
            ))}
          </div>
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            spellCheck={false}
            aria-label="nonce word"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.85rem',
              width: '8rem',
              padding: '0.3rem 0.5rem',
              background: 'transparent',
              color: 'var(--ink)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius)',
            }}
          />
        </div>
      </div>

      <div className="mt-readout" style={{ fontSize: '1rem' }}>
        {r ? (
          <>
            {r.stem}
            <strong style={{ textDecoration: 'underline' }}>{r.before}</strong>
            {r.tail}
            <span className="mt-dim"> : </span>
            {r.voiced} before the s, so the plural is <strong>{r.ending}</strong>
          </>
        ) : (
          <span className="mt-hint">type a made-up word ending in s</span>
        )}
      </div>

      <div className="mt-controls">
        {model ? (
          SIZES.map((s, i) => (
            <div key={s} className="mt-ctrl">
              <span className="mt-dim">{s} output</span>
              <strong style={{ color: 'var(--ink)', fontSize: '0.95rem' }}>{model[i]}</strong>
            </div>
          ))
        ) : (
          <div className="mt-ctrl">
            <span className="mt-dim">
              no model output for this word. the line above is a hand-written rule, not the model, shown to make the
              pattern the models learned explicit.
            </span>
          </div>
        )}
      </div>
      <div className="mt-ctrl" style={{ marginTop: '0.75rem' }}>
        <span className="mt-dim">
          model outputs are from the post's table. the voicing line is a rule-based stand-in that reads spelling, so
          it can be fooled by things like silent letters.
        </span>
      </div>
    </div>
  );
}
