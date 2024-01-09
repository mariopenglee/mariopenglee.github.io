import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Home from '../pages/Home';
import About from '../pages/About';
import './Landing.css';
import {  motion } from 'framer-motion';

gsap.registerPlugin(ScrollToPlugin);

function Landing() {
  
  const arrowRef = useRef(null);

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

  return (
    <>
      <div className="App">
        <main>
          <Home />
            <motion.div 
              className="scroll-arrow" 
              onClick={scrollToAbout} 
              ref={arrowRef}
              >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 9L12 1L20 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          <About />
        </main>
        <footer>{/* Footer content here */}</footer>
      </div>
    </>
  );
}

export default Landing;
