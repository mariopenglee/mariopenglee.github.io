import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Home from '../pages/Home';
import About from '../pages/About';
import './Landing.css';
import {  motion } from 'framer-motion';

gsap.registerPlugin(ScrollToPlugin);

function Landing() {

  const arrowRef = useRef(null);
  const location = useLocation();

  const scrollToAbout = () => {
    gsap.to(window, { duration: 1, scrollTo: '#about' });
  };

  useEffect(() => {
    const checkIfTop = () => {
      const atTop = window.scrollY === 0;

      // Animate the arrow
      if (!atTop) {
        gsap.to(arrowRef.current, { duration: 1, scale: 1.5, opacity: 0, y: -50, ease: 'power3.out' });


      } else {
        gsap.to(arrowRef.current, { duration: 1, scale: 1, opacity: 1, y: 0, ease: 'power3.out' });
       
      }
    };

    window.addEventListener('scroll', checkIfTop);
    return () => window.removeEventListener('scroll', checkIfTop);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('section') === 'about') {
      scrollToAbout();
    }
  }, [location]);

  return (
    <>
      <div className="App">
        <main>
          <Home />
            <motion.div 
              className="scroll-pill" 
              onClick={scrollToAbout} 
              ref={arrowRef}
            >
              <span className="scroll-pill-emoji" role="img" aria-label="wave">👋</span>
              <span className="scroll-pill-text">
                Let me introduce myself
              </span>
            </motion.div>
          <About />
        </main>
        <footer>{/* Footer content here */}</footer>
      </div>
    </>
  );
}

export default Landing;
