import { useLayoutEffect } from "react";
import "./About.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll } from "framer-motion";


// Initialize ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function Story() {
  const { scrollYProgress } = useScroll();

   useLayoutEffect(() => {
    
    gsap.utils.toArray(".statement-item").forEach((item) => {
      const element = item as HTMLElement;
      ScrollTrigger.create({
        trigger: element,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => gsap.to(element, { opacity: 1 }),
        onLeave: () => gsap.to(element, { opacity: 0.2 }),
        onEnterBack: () => gsap.to(element, { opacity: 1 }),
        onLeaveBack: () => gsap.to(element, { opacity: 0.2 }),
        markers: false,
        scrub: true,
      });
    });

    

    

   

  }, []);

  return (
    <section id="about">
      <motion.div
      className="progress-bar"
      style={{ scaleX: scrollYProgress }}
      />
      <div className = "statement">
        <div className="statement-title">
          <div className="statement-title-text">
            Hello there!
          </div>
        </div>
        <div className = "statement-list">
          <div className = "statement-item" 
            style={{ marginLeft: 0 }}
          >
          My name is Mario. I'm a Taiwanese descendant, but my heart is in Argentina, where I grew up.
          </div>
          <div className = "statement-item">
          I aim to create technology that is accessible, inclusive, understandable, and safe. Therefore I'm also juggling multiple initiatives and start-ups to make a positive impact in the world. 
          </div>
          <div className = "statement-item">
          I'm a recent graduate from UCLA, where I studied Linguistics, Computer Science, and Psychology. I've also been involved in research in AI safety and ethics. Check out
          {' '}
          <a 
              href="https://newsroom.ucla.edu/stories/mario-peng-lee-artificial-intelligence-safety-ucla-commencement-2024"
              
              >
                this artcle
                
              </a>
          {' '}
              
          to learn more about my journey.
          </div>
          <div className = "statement-item">
            I'm currently looking for a full-time position in software engineering, product management, or data science.
            </div>
         

        </div>
    </div>

      
      
    </section>
  );
}

export default Story;
