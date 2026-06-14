export const SITE = {
  name: 'mario peng lee',
  role: 'AI Engineer',
  company: 'nexos.ai',
  companyUrl: 'https://nexos.ai/',
};

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
    title: 'Code Interpreter at nexos.ai',
    desc: 'a sandboxed runtime that lets our agents write and run code safely',
    links: [
      {
        name: 'writeup',
        url: 'https://www.linkedin.com/pulse/code-interpreter-how-weve-built-ourselves-nexos-ai-hgckf/',
      },
    ],
  },
  {
    title: 'The Diverse Names Generator',
    desc: 'linguist-curated tool for reducing name bias in data, published at LSA 2023',
    links: [
      { name: 'paper', url: 'https://journals.linguisticsociety.org/proceedings/index.php/PLSA/article/view/5541' },
      { name: 'live', url: 'https://diversenamesgenerator.com/' },
    ],
  },
  {
    title: 'AI safety research at UCLA',
    desc: 'undergrad research on AI safety and ethics, featured by UCLA Newsroom',
    links: [
      {
        name: 'feature',
        url: 'https://newsroom.ucla.edu/stories/mario-peng-lee-artificial-intelligence-safety-ucla-commencement-2024',
      },
    ],
  },
  {
    title: 'PhoneTic5',
    desc: 'transfer learning for grapheme-to-phoneme conversion',
    links: [
      { name: 'preprint', url: 'https://drive.google.com/file/d/1UBAq5x_5ZNalz5k98V0eq55oVT-PO4VP/view' },
      { name: 'demo', url: 'https://phonetic5.streamlit.app/' },
    ],
  },
];
