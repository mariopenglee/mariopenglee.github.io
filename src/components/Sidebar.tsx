import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [lang, setLang] = useState<'en' | 'zh' | 'es'>('en');

  let displayName;
  let role;
  if (lang === 'en') {
    displayName = 'Mario Peng\u00A0Lee';
    role = 'AI Engineer';
  } else if (lang === 'zh') {
    displayName = '彭立全';
    role = 'AI Engineer';
  } else if (lang === 'es') {
    displayName = 'Mario Peng\u00A0Lee';
    role = 'Ingeniero de IA';
  }

  // Helper to detect mobile
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  return (
    <div className="sidebar">
      {/* Profile and social links always on top */}
      <div className="profile">
        <Link to="/" style={{ display: 'block', width: 'fit-content', margin: '0 auto' }}>
          <img src="/portrait.png" alt="portrait" className="profile-img" style={{ cursor: 'pointer' }} />
        </Link>
        {!isMobile && (
          <>
            <h1 className="profile-name">
              <Link to="/">{displayName}</Link>
            </h1>
            {lang === 'zh' && (
              <div className="profile-chinese-block">
                <span className="profile-ipa">[pʰə̌ŋ lî tɕʰyɛ̌n]</span>
              </div>
            )}
            <p className="profile-tagline">{role}</p>
            <div className="profile-lang-flags">
              <button onClick={() => setLang('en')} aria-label="English" className={lang==='en' ? 'active' : ''}>🇬🇧</button>
              <button onClick={() => setLang('zh')} aria-label="Chinese" className={lang==='zh' ? 'active' : ''}>🇨🇳</button>
              <button onClick={() => setLang('es')} aria-label="Spanish" className={lang==='es' ? 'active' : ''}>🇪🇸</button>
            </div>
          </>
        )}
        <div className="profile-contact-icons">
          <a href="https://www.linkedin.com/in/mariopenglee/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="contact-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
          </a>
          <a href="https://github.com/mariopenglee" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="contact-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.012-1.243-.017-2.252-3.338.726-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.289-1.552 3.295-1.23 3.295-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.625-5.475 5.921.43.372.823 1.104.823 2.225 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.373-12-12-12z"/></svg>
          </a>
         <a href="https://scholar.google.com/citations?user=g5-ua5oAAAAJ&hl" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" className="contact-icon">
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <path fill="#fff" d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zM3.5 10.5v3c0 2.17 3.58 4 8 4s8-1.83 8-4v-3L12 13 3.5 10.5z"/>
  </svg>
</a>

          <a href="https://drive.google.com/file/d/1iMqFVWe2bbiVVxuoxsXdHfDLJeahqtRg/view?usp=sharing" target="_blank" rel="noopener noreferrer" aria-label="Resume" className="contact-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </a>
        </div>
        {/* Desktop nav below portrait */}
        {!isMobile && (
          <nav
            className="sidebar-nav"
            style={{
              gap: '0.2rem', // reduced gap
              paddingTop: '0.3rem', // reduced padding
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              maxHeight: '120px', // ensure all fit
              justifyContent: 'flex-start',
              overflow: 'visible',
              minHeight: 0
            }}
          >
            <span className="sidebar-link"><Link to="/">About</Link></span>
            <span className="sidebar-link"><Link to="/projects">Projects</Link></span>
            <span className="sidebar-link"><Link to="/updates">Updates</Link></span>
          </nav>
        )}
      </div>
      {/* Pill selector only on mobile, below profile */}
      {isMobile && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <nav
            className="sidebar-mobile-selector"
            style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #23242a 60%, #232f47 100%)',
              borderRadius: 999,
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
              border: '1.5px solid #353545',
              padding: '0.4rem 0.7rem',
              alignItems: 'center',
              zIndex: 2200,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          >
            <Link to="/" className="sidebar-link sidebar-pill" style={{ padding: '0.35rem 1.1rem', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: '#eaeaf0', fontWeight: 400, fontSize: 16, border: '1.5px solid transparent', userSelect: 'none', textDecoration: 'none' }}>About</Link>
            <Link to="/projects" className="sidebar-link sidebar-pill" style={{ padding: '0.35rem 1.1rem', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: '#eaeaf0', fontWeight: 400, fontSize: 16, border: '1.5px solid transparent', userSelect: 'none', textDecoration: 'none' }}>Projects</Link>
            <Link to="/updates" className="sidebar-link sidebar-pill" style={{ padding: '0.35rem 1.1rem', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: '#eaeaf0', fontWeight: 400, fontSize: 16, border: '1.5px solid transparent', userSelect: 'none', textDecoration: 'none' }}>Updates</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
