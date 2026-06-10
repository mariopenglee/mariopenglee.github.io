import { SITE } from '../data/site';

export default function Prompt({ path = '~', cmd }: { path?: string; cmd: string }) {
  return (
    <div className="prompt">
      <span className="user">{SITE.user}</span>
      <span className="sigil">:</span>
      <span className="path">{path}</span>
      <span className="sigil">$</span>
      <span className="cmd"> {cmd}</span>
    </div>
  );
}
