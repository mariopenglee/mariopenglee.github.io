import { useEffect, useRef, useState } from 'react';

// glyphs the characters cycle through before they settle into the real letter
const GLYPHS = '▓▒░#%&@*+=-<>/\\|';

function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function noisy(text: string): string {
  return text
    .split('')
    .map((c) => (c === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join('');
}

// renders `text` as if it's denoising into place: each character flickers
// through random glyphs and settles left-to-right over `duration` ms. runs
// once on mount. respects prefers-reduced-motion (shows the final text).
export default function Denoise({
  text,
  className,
  duration = 900,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(() => (reducedMotion() ? text : noisy(text)));
  const raf = useRef<number>(0);

  useEffect(() => {
    if (reducedMotion()) {
      setDisplay(text);
      return;
    }

    const chars = text.split('');
    // each char settles somewhere in the back half of the timeline, staggered
    // by position so the name resolves from left to right
    const settle = chars.map((_, i) =>
      duration * 0.4 + (i / Math.max(chars.length - 1, 1)) * duration * 0.6
    );

    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = now - start;
      let done = true;
      const out = chars.map((c, i) => {
        if (c === ' ') return ' ';
        if (t >= settle[i]) return c;
        done = false;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });
      setDisplay(out.join(''));
      if (done) setDisplay(text);
      else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, duration]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
