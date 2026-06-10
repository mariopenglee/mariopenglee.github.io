import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './theme';
import { SITE, NAV } from './data/site';
import CommandBar from './components/CommandBar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Post from './pages/Post';
import './index.css';

function pathLabel(pathname: string): string {
  if (pathname === '/blog') return '~/blog';
  if (pathname.startsWith('/blog/')) return `~/blog/${pathname.slice('/blog/'.length)}`;
  return '~';
}

function TitleBar() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const path = pathLabel(pathname);
  return (
    <div className="titlebar">
      <div className="dots">
        <span className="dot dot--r" />
        <span className="dot dot--y" />
        <span className="dot dot--g" />
      </div>
      <div className="titlebar-title">
        <b>{SITE.user}</b> &mdash; {path} &mdash; zsh
      </div>
      <button className="theme-toggle" onClick={toggle} aria-label="toggle color theme">
        {theme === 'dark' ? '☀ light' : '☾ dark'}
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="crt">
      <div className="window">
        <TitleBar />
        <main className="screen">
          <nav className="nav" aria-label="primary">
            {NAV.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Post />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <CommandBar />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
