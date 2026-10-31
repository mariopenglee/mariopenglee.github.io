import './manifold.css';

// Ratios from the paper-2 draft (our matching rule): unmatched share left by
// each perturbation, divided by the unmatched share a new seed leaves.
const ROWS: Array<{ label: string; r: number; note?: string }> = [
  { label: 'kernel noise · Pythia-160m', r: 0.43 },
  { label: 'kernel noise · GPT-2, 1B tok, lr ×1', r: 0.57 },
  { label: 'kernel noise · Llama-3.1-8B', r: 0.73 },
  { label: 'kernel noise · GPT-2, 1B tok, lr ×2', r: 0.77 },
  { label: 'kernel noise · GPT-2, 4B tok, lr ×2', r: 0.85 },
  { label: 'one-bit flip, step 0 · GPT-2', r: 0.5 },
  { label: 'document order · GPT-2', r: 0.82 },
];

export default function NoiseShare() {
  return (
    <div className="mt-demo">
      <p className="mt-panel-cap" style={{ marginBottom: '0.8rem' }}>
        <span style={{ whiteSpace: 'normal' }}>unmatched latents, as a share of what a new seed leaves unmatched</span>
      </p>
      {ROWS.map((row) => (
        <div key={row.label} style={{ marginBottom: '0.55rem' }}>
          <div className="mt-panel-cap" style={{ marginBottom: '0.2rem' }}>
            <span style={{ whiteSpace: 'normal' }}>{row.label}</span>
            <span className="mt-pct">{row.r.toFixed(2)}</span>
          </div>
          <div style={{ height: 8, background: 'var(--line)', borderRadius: 2 }}>
            <div style={{ width: `${row.r * 100}%`, height: '100%', background: 'var(--ink)', borderRadius: 2 }} />
          </div>
        </div>
      ))}
      <p className="mt-readout" style={{ fontSize: '0.75rem' }}>
        1.00 = as different as two seeds · same init in every row
      </p>
    </div>
  );
}
