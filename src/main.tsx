import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './screens/Landing';
import Projects from './pages/Projects';
import Updates from './pages/Updates';
import CustomCursor from './components/CustomCursor';
import { AnimatePresence } from 'framer-motion';

import './index.css';

const App = () => {
  const location = useLocation();

  return (
    <>
      <Sidebar />
      <div className="content">
        <CustomCursor />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
