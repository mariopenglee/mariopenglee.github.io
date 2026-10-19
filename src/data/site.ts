export const SITE = {
  name: 'mario peng lee',
  role: 'cofounder',
  company: 'condense.chat',
  tagline: 'making powerful AI accessible to everyone, and safe when it gets there.',
  companyUrl: 'https://condense.chat/',
};

// about paragraphs, markdown. also feeds llms.txt and the no-JS fallback (vite.config.ts)
export const BIO: string[] = [
  "I'm cofounder and chief scientist at [condense.chat](https://condense.chat/), which compresses what coding agents send to the model so heavy AI workloads cost less (up to about 70% off long sessions, with basically the same output). I'm also CEO of [Pocketful](https://pocketful.ai/), which brings WhatsApp AI agents to restaurant owners in Argentina. Same mission for both: AI that everyone can actually afford and use.",
  "My background is in linguistics, computer science and psychology (UCLA, Phi Beta Kappa). What I'm most interested in is how minds, human and machine, represent things, and how understanding that makes AI cheaper and safer. These days that means open-source interpretability research at [EleutherAI](https://www.eleuther.ai/).",
  'Before condense I was a senior AI engineer at [nexos.ai](https://nexos.ai/), where I built the agent layer, the memory model behind nexos.heartbeat, and a sandboxed code interpreter.',
];

export const LINKS: { name: string; key: string; url: string }[] = [
  { name: 'linkedin', key: 'linkedin', url: 'https://www.linkedin.com/in/mariopenglee/' },
  { name: 'github', key: 'github', url: 'https://github.com/mariopenglee' },
  { name: 'scholar', key: 'scholar', url: 'https://scholar.google.com/citations?user=g5-ua5oAAAAJ&hl' },
  { name: 'cv', key: 'cv', url: 'https://drive.google.com/file/d/1iMqFVWe2bbiVVxuoxsXdHfDLJeahqtRg/view?usp=sharing' },
];

export const NAV: { label: string; path: string }[] = [
  { label: 'about', path: '/' },
  { label: 'blog', path: '/blog' },
];

// talks — recordings of me presenting. youtube id + where/when it was given.
// poster: optional custom still (a frame from the talk) used instead of the
// default youtube thumbnail. lives in /public.
export const TALKS: {
  id: string;
  title: string;
  meta: string;
  url: string;
  poster?: string;
}[] = [
  {
    id: 'KoVKYMgw2H0',
    title: 'nexos.heartbeat: an AI engine that works while you sleep',
    meta: 'nexos.ai · product demo',
    url: 'https://www.youtube.com/watch?v=KoVKYMgw2H0',
  },
  {
    id: 'PC2wbY8yAbA',
    title: 'Using AI Agents to Navigate Data Chaos',
    meta: 'nexos.ai · Danske Bank Lithuania',
    url: 'https://www.youtube.com/watch?v=PC2wbY8yAbA',
    poster: '/talk-data-chaos.jpg',
  },
];

// curated highlights shown on the home page — deep-dives belong in the blog
export const WORK: { title: string; desc: string; links: { name: string; url: string }[] }[] = [
  {
    title: 'nexos.heartbeat',
    desc: 'always-on AI twin and the biggest feature at nexos, where I built the memory and continuity model',
    links: [
      { name: 'writeup', url: '#/blog/heartbeat' },
      { name: 'demo', url: 'https://www.youtube.com/watch?v=KoVKYMgw2H0' },
    ],
  },
  {
    title: 'Do SAEs capture concept manifolds?',
    desc: 'open-source interpretability research at EleutherAI: pooling sparse autoencoders that differ only in seed tiles a concept manifold back together where one SAE dilutes it',
    links: [
      { name: 'writeup', url: '#/blog/cross-seed-saes' },
      { name: 'code', url: 'https://github.com/mariopenglee/cross-seed-manifold-poc' },
    ],
  },
  {
    title: 'Code Interpreter at nexos.ai',
    desc: 'a sandboxed runtime that lets our agents write and run code safely',
    links: [
      {
        name: 'writeup',
        url: 'https://www.linkedin.com/pulse/code-interpreter-how-weve-built-ourselves-nexos-ai-hgckf/',
      },
    ],
  },
];

// undergrad research — collaborators in parentheses, links optional
export const RESEARCH: typeof WORK = [
  {
    title: 'GPT-4 vs. children: narrative cohesion in wordless picture books',
    desc: 'how children aged 4 to 6 and GPT-4 tie a story together while narrating a wordless book, measured with coreference chains (with Catherine Sandhofer, Amalia Ionescu)',
    links: [{ name: 'writeup', url: '#/blog/kids-vs-llm-stories' }],
  },
  {
    title: 'CycleDiffusion',
    desc: 'relational representations in visual models (with Andrew Lee, Hongjin Lu)',
    links: [{ name: 'writeup', url: '#/blog/cyclediffusion' }],
  },
  {
    title: 'PhoneTic5',
    desc: 'independent project: a T5 grapheme-to-phoneme model, published in the UCLA Undergraduate Science Journal (2023)',
    links: [
      { name: 'preprint', url: 'https://drive.google.com/file/d/1UBAq5x_5ZNalz5k98V0eq55oVT-PO4VP/view' },
      { name: 'demo', url: 'https://phonetic5.streamlit.app/' },
    ],
  },
  {
    title: 'child language and concept acquisition',
    desc: 'experiments on how kids pick up words and concepts, at the Language and Development Lab',
    links: [],
  },
  {
    title: 'The Diverse Names Generator',
    desc: 'a diverse and gender-neutral name generator for linguistic examples, published at LSA 2023 (with Maura O\'Leary)',
    links: [
      { name: 'paper', url: 'https://journals.linguisticsociety.org/proceedings/index.php/PLSA/article/view/5541' },
      { name: 'live', url: 'https://diversenamesgenerator.com/' },
    ],
  },
];

export const LEADERSHIP: typeof WORK = [
  {
    title: 'AI Safety at UCLA',
    desc: 'co-founded it, raised about $150k, and led its alignment research team',
    links: [
      {
        name: 'feature',
        url: 'https://newsroom.ucla.edu/stories/mario-peng-lee-artificial-intelligence-safety-ucla-commencement-2024',
      },
    ],
  },
  {
    title: 'a16z speedrun Global Founder Sprint',
    desc: 'selected with condense.chat, SF Tech Week 2026',
    links: [],
  },
  {
    title: 'Phi Beta Kappa',
    desc: 'UCLA, 2024',
    links: [],
  },
];
