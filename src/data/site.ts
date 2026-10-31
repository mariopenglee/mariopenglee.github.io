export const SITE = {
  name: 'mario peng lee',
  role: 'cofounder',
  company: 'condense.chat',
  tagline: 'making powerful AI accessible to everyone, and safe when it gets there.',
  companyUrl: 'https://condense.chat/',
};

// about paragraphs, markdown. also feeds llms.txt and the no-JS fallback (vite.config.ts)
export const BIO: string[] = [
  "I'm cofounder and chief scientist at [condense.chat](https://condense.chat/), which compresses what coding agents send to the model so heavy AI workloads cost less (up to about 70% off long sessions, with basically the same output). I'm also CEO of [Pocketful](https://pocketful.ai/), which brings WhatsApp AI agents to restaurant owners in Argentina. Both are basically the same bet, that AI should be cheap and usable enough for everyone.",
  "My background is in linguistics, computer science and psychology (UCLA, Phi Beta Kappa). Mostly I'm interested in how minds (human and machine) represent things, and my view is that understanding that is how AI gets cheaper and safer. These days that means open-source interpretability research at [EleutherAI](https://www.eleuther.ai/) through SOAR 2026 (its Summer of Open AI Research, about 2% of applicants accepted), lately on how stable sparse autoencoder features are across seeds.",
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
  { label: 'talks', path: '/talks' },
];

// quick proof points under the hero, most impressive first. url optional.
export const HIGHLIGHTS: { text: string; url?: string }[] = [
  { text: 'spoke at WIP: Index Ventures x Anthropic, London', url: '#/blog/infinite-context-agents-wip-london' },
  { text: 'EleutherAI SOAR 2026 (about 2% of applicants accepted)', url: '#/blog/orphan-latents' },
  { text: 'a16z speedrun Global Founder Sprint, with condense.chat' },
  {
    text: 'co-founded AI Safety at UCLA, raised about $150k',
    url: 'https://newsroom.ucla.edu/stories/mario-peng-lee-artificial-intelligence-safety-ucla-commencement-2024',
  },
];

// posts shown under "writing" on the home page, in this order (slugs).
// everything else is on /blog, newest first.
export const FEATURED_POSTS = [
  'orphan-latents',
  'infinite-context-agents-wip-london',
  'same-init-different-dictionary',
  'role-collapse',
];

// how many talks the home page shows before "all talks"
export const HOME_TALKS = 2;

// talks. with a youtube id the card plays the recording inline; without one
// it links out (url) and shows the poster photo, or a text tile if none.
// poster: optional custom still, lives in /public.
export const TALKS: {
  id?: string;
  title: string;
  meta: string;
  url: string;
  poster?: string;
}[] = [
  {
    title: 'Infinite context agents',
    meta: 'nexos.ai · WIP: Index Ventures x Anthropic, London, Apr 2026 · with Anthropic, Revolut, Wiz, ElevenLabs',
    url: '#/blog/infinite-context-agents-wip-london',
    poster: '/talk-anthropic-wip.jpg',
  },
  {
    title: 'Psychology for agent design',
    meta: 'nexos.ai · Tesonet AI-Focused Conference, Vilnius, Nov 2025 · with Amazon, Google Cloud Security, Hostinger',
    url: '#/blog/psychology-for-agent-design-tesonet',
    poster: '/talk-tesonet.jpg',
  },
  {
    id: 'PC2wbY8yAbA',
    title: 'Using AI Agents to Navigate Data Chaos',
    meta: 'nexos.ai · Danske Bank Tech Night, Vilnius, Nov 2025',
    url: 'https://www.youtube.com/watch?v=PC2wbY8yAbA',
    poster: '/talk-data-chaos.jpg',
  },
  {
    id: 'KoVKYMgw2H0',
    title: 'nexos.heartbeat: an AI engine that works while you sleep',
    meta: 'nexos.ai · product demo',
    url: 'https://www.youtube.com/watch?v=KoVKYMgw2H0',
  },
  {
    title: 'On stage for nexos.ai',
    meta: 'Nord Demo Day, Vilnius, Nov 2025',
    url: 'https://www.linkedin.com/posts/mariopenglee_honored-to-represent-our-team-on-stage-and-ugcPost-7395414989592956928-noqm/',
    poster: '/talk-nord-demo-day.jpg',
  },
  {
    title: 'Model-agnostic interpretability and its real-world uses',
    meta: 'nexos.ai meetup, Jun 2025',
    url: '#/blog/gpt2-ioi',
    poster: '/talk-nexos-meetup.jpg',
  },
];

// curated highlights shown on the home page — deep-dives belong in the blog
// most impressive first
export const WORK: { title: string; desc: string; links: { name: string; url: string }[] }[] = [
  {
    title: 'condense.chat',
    desc: 'cofounder and chief scientist: compresses what coding agents send to the model, up to about 70% off long sessions with basically the same output (a16z speedrun Global Founder Sprint)',
    links: [{ name: 'site', url: 'https://condense.chat/' }],
  },
  {
    title: 'Sparse autoencoder seeds share more than matching shows',
    desc: 'EleutherAI SOAR 2026 (about 2% of applicants accepted), supervised by Gonçalo Paulo: one-to-one matching says two SAE seeds share about half their latents, a toy-calibrated transplant test estimates 75 to 86%',
    links: [
      { name: 'writeup', url: '#/blog/orphan-latents' },
      { name: 'kernel noise', url: '#/blog/same-init-different-dictionary' },
    ],
  },
  {
    title: 'nexos.heartbeat',
    desc: "always-on AI twin and nexos.ai's biggest feature; I built the memory and continuity model (git-backed memory, presented at WIP: Index Ventures x Anthropic)",
    links: [
      { name: 'writeup', url: '#/blog/heartbeat' },
      { name: 'talk', url: '#/blog/infinite-context-agents-wip-london' },
      { name: 'demo', url: 'https://www.youtube.com/watch?v=KoVKYMgw2H0' },
    ],
  },
  {
    title: 'Code Interpreter at nexos.ai',
    desc: 'a sandboxed runtime that lets agents write and run real code, each run in an isolated, throwaway micro-VM',
    links: [{ name: 'writeup', url: '#/blog/code-interpreter-nexos' }],
  },
  {
    title: 'Pocketful',
    desc: 'CEO: WhatsApp AI agents for restaurant owners in Argentina',
    links: [{ name: 'site', url: 'https://pocketful.ai/' }],
  },
  {
    title: 'Where role collapse happens in diffusion models',
    desc: 'why SDXL and SD3.5 draw "a mouse chasing a cat" as a cat chasing a mouse: the text encoder carries the roles, and the denoiser ignores them',
    links: [{ name: 'writeup', url: '#/blog/role-collapse' }],
  },
  {
    title: 'Do SAEs capture concept manifolds?',
    desc: 'the toy phase of the SAE seed work: pooling sparse autoencoders that differ only in seed tiles a concept manifold back together where one SAE dilutes it',
    links: [
      { name: 'writeup', url: '#/blog/cross-seed-saes' },
      { name: 'code', url: 'https://github.com/mariopenglee/cross-seed-manifold-poc' },
    ],
  },
];


// articles I wrote elsewhere (nexos.ai blog, shared on LinkedIn)
export const ARTICLES: typeof WORK = [
  {
    title: 'Code interpreter: how we built it ourselves',
    desc: 'nexos.ai, Jan 2026: letting the model run real code in an isolated micro-VM instead of guessing',
    links: [
      { name: 'read', url: '#/blog/code-interpreter-nexos' },
      { name: 'original', url: 'https://www.linkedin.com/pulse/code-interpreter-how-weve-built-ourselves-nexos-ai-hgckf' },
    ],
  },
  {
    title: "RAG isn't dead, plain RAG is",
    desc: 'nexos.ai, Dec 2025, with Povilas Nagrockas: organize the knowledge before you retrieve it',
    links: [
      { name: 'read', url: '#/blog/rethinking-rag' },
      { name: 'original', url: 'https://www.linkedin.com/pulse/rethinking-rag-why-knowledge-organization-new-competitive-advantage-kxkze' },
    ],
  },
  {
    title: 'Context engineering: where AI stops guessing',
    desc: 'LinkedIn, Nov 2025: getting the right context in front of the model, not a bigger model',
    links: [
      { name: 'read', url: '#/blog/context-engineering' },
      {
        name: 'original',
        url: 'https://www.linkedin.com/posts/mariopenglee_the-real-challenge-in-enterprise-ai-today-share-7396873975009751040-niZ9/',
      },
    ],
  },
  {
    title: 'Psychology-inspired agentic AI',
    desc: 'nexos.ai, Nov 2025, the long version of my Tesonet talk',
    links: [
      { name: 'read', url: '#/blog/psychology-inspired-agentic-ai' },
      { name: 'original', url: 'https://www.linkedin.com/pulse/psychology-inspired-agentic-ai-nexos-ai-vi0le' },
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
      { name: 'writeup', url: '#/blog/phonetic5' },
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
    desc: 'a diverse and gender-neutral name generator for linguistic examples, published at LSA 2023 (with Maura O\'Leary and Rainey Williams)',
    links: [
      { name: 'writeup', url: '#/blog/diverse-names' },
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
