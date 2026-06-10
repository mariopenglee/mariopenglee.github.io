export const SITE = {
  name: 'mario peng lee',
  user: 'mario@penglee',
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

// curated highlights shown in about.md — deep-dives belong in the blog
export const WORK: { title: string; desc: string; links: { name: string; url: string }[] }[] = [
  {
    title: 'The Diverse Names Generator',
    desc: 'linguist-curated tool for reducing name bias in data, published at LSA 2023',
    links: [
      { name: 'paper', url: 'https://journals.linguisticsociety.org/proceedings/index.php/PLSA/article/view/5541' },
      { name: 'live', url: 'https://diversenamesgenerator.com/' },
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
  {
    title: 'AI safety research @ UCLA',
    desc: 'undergrad research on AI safety and ethics',
    links: [
      {
        name: 'feature',
        url: 'https://newsroom.ucla.edu/stories/mario-peng-lee-artificial-intelligence-safety-ucla-commencement-2024',
      },
    ],
  },
];
