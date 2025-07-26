import './Home.css';
import { Canvas } from '@react-three/fiber';
import Astronaut from '../components/Astronaut';
import Stars from '../components/Stars';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Initialize ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function Home() {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 40,
      scale: 0.98,
      filter: 'blur(8px)',
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    out: {
      opacity: 0,
      y: -40,
      scale: 0.98,
      filter: 'blur(8px)',
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const pageTransition = {
    type: "tween",
    ease: [0.4, 0, 0.2, 1],
    duration: 0.7
  };
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Target all components you want to animate
    if (!sectionRef.current) {
      return;
    }
      
    const elements = sectionRef.current.querySelectorAll('.animatable');

    // Animate each component to fade in and up
    gsap.fromTo(elements, {
      autoAlpha: 0,
      y: -50,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      stagger: 1,
      ease: 'power3.out',
    });

    const animation = gsap.to('#home', {
      y: () => `50vh`,
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        toggleActions: 'play none none reverse', // This will play the animation when it comes into view and reverse when it goes out of view
      },
    });

    return () => {
      animation.kill(); // Stop the animation and clear its related ScrollTrigger
    };
  }, []);


  return (
    <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    >
      <div className="home-bg" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: "linear-gradient(180deg, #000 0%, #18181a 100%)"
      }} />
      <div className="home" style={{
        position: 'relative',
        minHeight: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <section id="home" ref={sectionRef} style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', maxWidth: 900, margin: '0 auto', padding: '0 1.5rem', gap: '3vw', position: 'relative'}}>
          <div className="myname animatable" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 0, zIndex: 1}}>
            <h1 className='hey' style={{
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              color: '#f5f5f7',
              letterSpacing: '-0.03em',
              margin: 0,
              paddingTop: '0',
              paddingBottom: '0',
              textShadow: '0 2px 24px rgba(0,0,0,0.12)',
              textAlign: 'left',
            }}>Hey<span style={{color: '#007aff'}}>.</span></h1>
            <p style={{
              marginTop: '1.5rem',
              fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
              fontWeight: 500,
              color: '#e0e0e6',
              textAlign: 'left',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}>
              welcome to my <span style={{
                background: 'linear-gradient(90deg, #007aff 0%, #b16cea 50%, #ff6bcb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700
              }}>space</span>
            </p>
          </div>

        </section>
                    <Canvas 
              className="canvas"
              gl={{ antialias: true }}
              dpr={[1, 2]}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 0,


              }}
            >
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1.2} color="#b0c4ff" />
              <Astronaut />
              <Stars />
            </Canvas>
      </div>
    </motion.div>
  );
}

export default Home;
