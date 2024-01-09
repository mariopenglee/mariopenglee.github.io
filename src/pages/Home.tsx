import './Home.css';
import { Canvas } from '@react-three/fiber';
import InteractiveSquare from '../components/InteractiveSquare';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EffectComposer, Pixelation, ChromaticAberration } from '@react-three/postprocessing'
import { Vector2 } from 'three';

// Initialize ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function Home() {
  const pageVariants = {
    initial: {
      x: "100vw",
      transition: {
        duration: 1,
        type: "spring",
        stiffness: 50
      }
    },
    in: {
      x: 0,
      transition: {
        duration: 1,
        type: "spring",
        stiffness: 50
      }
      
    },
    out: {
      x: "-100vw",
      transition: {
        duration: 1,
        type: "spring",
        stiffness: 50
      }
      
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 1
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
  const offsetVector = new Vector2(0.01, 0.01);


  return (
    <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    >
      <div className="home">
        <section id="home" ref={sectionRef}>
          <div className="mix-blend animatable">
            <div className="myname animatable"><h1>MARIO</h1> <h1>PENG LEE</h1></div>
            <Canvas 
            className="canvas animatable"
            gl={{ antialias: false }}
            dpr={[1, 2]}
            >
              <EffectComposer>
                <Pixelation granularity={5}/>
                <ChromaticAberration 
                offset={offsetVector} 
                radialModulation={true}
                modulationOffset={0}
                />
              </EffectComposer>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <InteractiveSquare />
            </Canvas>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default Home;
