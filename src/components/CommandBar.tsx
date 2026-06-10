import { useRef, useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import { LINKS, SITE } from '../data/site';

const HELP = [
  'available commands:',
  '  about        whoami / go home',
  '  blog         read the blog',
  '  ls           list sections',
  '  theme        toggle light / dark',
  '  linkedin · github · scholar · cv',
  '  clear        clear this line',
].join('\n');

export default function CommandBar() {
  const [value, setValue] = useState('');
  const [out, setOut] = useState('type `help` to get started.');
  const [outKind, setOutKind] = useState<'ok' | 'err' | 'dim'>('dim');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const navigate = useNavigate();
  const { toggle, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const say = (msg: string, kind: 'ok' | 'err' | 'dim' = 'dim') => {
    setOut(msg);
    setOutKind(kind);
  };

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');

    switch (head) {
      case 'help':
      case '?':
      case 'man':
        say(HELP, 'ok');
        break;
      case 'ls':
      case 'dir':
        say('about/   blog/', 'ok');
        break;
      case 'whoami':
        say(`${SITE.name} — ${SITE.role} @ ${SITE.company}`, 'ok');
        break;
      case 'about':
      case 'home':
      case 'cd':
        navigate(arg === 'blog' ? '/blog' : '/');
        say('', 'dim');
        break;
      case 'projects':
        navigate('/');
        say('projects/ was merged into about (selected work) — deep-dives live in the blog now', 'ok');
        break;
      case 'blog':
      case 'posts':
      case 'writing':
        navigate('/blog');
        say('opening blog/', 'ok');
        break;
      case 'theme': {
        if (arg === 'dark' || arg === 'light') {
          setTheme(arg);
          say(`theme set to ${arg}`, 'ok');
        } else {
          toggle();
          say('theme toggled', 'ok');
        }
        break;
      }
      case 'clear':
      case 'cls':
        say('', 'dim');
        break;
      case 'sudo':
        say("nice try. you already have root here :)", 'ok');
        break;
      case 'linkedin':
      case 'github':
      case 'scholar':
      case 'cv':
      case 'resume': {
        const key = head === 'resume' ? 'cv' : head;
        const link = LINKS.find((l) => l.key === key);
        if (link) {
          window.open(link.url, '_blank', 'noopener,noreferrer');
          say(`opening ${link.name}…`, 'ok');
        } else {
          say(`command not found: ${head}`, 'err');
        }
        break;
      }
      default:
        say(`command not found: ${head} — try \`help\``, 'err');
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(value);
      if (value.trim()) {
        setHistory((h) => [...h, value.trim()]);
        setHIdx(-1);
      }
      setValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(next);
      setValue(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < 0) return;
      const next = hIdx + 1;
      if (next >= history.length) {
        setHIdx(-1);
        setValue('');
      } else {
        setHIdx(next);
        setValue(history[next]);
      }
    }
  };

  return (
    <div className="cmdbar" onClick={() => inputRef.current?.focus()}>
      {out && (
        <div className="cmdbar-out">
          <span className={outKind === 'ok' ? 'ok' : outKind === 'err' ? 'err' : ''}>{out}</span>
        </div>
      )}
      <div className="cmdbar-line">
        <span className="user">{SITE.user}:~$</span>
        <input
          ref={inputRef}
          className="cmdbar-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="help"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="terminal command input"
        />
      </div>
    </div>
  );
}
