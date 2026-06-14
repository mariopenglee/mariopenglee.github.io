import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider, useTheme } from './theme';
import { SITE, NAV } from './data/site';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Post from './pages/Post';
import './index.css';

function TopBar() {
  const { theme, toggle } = useTheme();
  return (
    <header className="topbar">
      <NavLink to="/" className="wordmark" aria-label="home">
        {SITE.name}
      </NavLink>
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
        <button className="theme-toggle" onClick={toggle} aria-label="toggle color theme">
          {theme === 'dark' ? 'light' : 'dark'}
        </button>
      </nav>
    </header>
  );
}

function App() {
  return (
    <div className="app">
      <TopBar />
      <main className="screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="footer">
        <span className="dim">
          {SITE.name} · built with react + vite
        </span>
      </footer>
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
