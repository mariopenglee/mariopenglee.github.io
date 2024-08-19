
import "./Contact.css";
import { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { EffectComposer, Pixelation } from '@react-three/postprocessing'
import { Canvas } from '@react-three/fiber';
import BackgroundModel from '../components/ContactBackground';


function Contact() {

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


  useLayoutEffect(() => {

    

   
  }, []);

  


  return (
    <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    >
    <section id="contact">
      

        <div className="business-card">
        <motion.button 
        className="contact-button" 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => window.open('https://www.linkedin.com/in/mariopenglee/', "_blank")}>
                                {'linkedin'}
        </motion.button>
        <motion.button 
        className="contact-button" 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => window.open('https://github.com/mariopenglee', "_blank")}>
                                {'github'}
        </motion.button>
        <motion.button 
        className="contact-button" 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => window.open('https://drive.google.com/file/d/1iMqFVWe2bbiVVxuoxsXdHfDLJeahqtRg/view?usp=sharing', "_blank")}>
                                {'resume'}
        </motion.button>
        <motion.button 
        className="contact-button" 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => window.open('mailto:mariopeng@ucla.edu', "_blank")}>
                                {'mail'}
        </motion.button>
        </div>

        <Canvas 
            className="canvas animatable"
            gl={{ antialias: false }}
            dpr={[1, 2]}
            >
              <EffectComposer>
                <Pixelation granularity={5}/>
              </EffectComposer>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <BackgroundModel />
      </Canvas>
     

    </section>
    </motion.div>
  );
}

export default Contact;
