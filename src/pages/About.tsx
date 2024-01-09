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
          I've studied in 5 countries, and this June 2024 I'll be obtaining my bachelor's degrees in Linguistics & Computer Science, Psychology, and Data Science at UCLA. 
          </div>
          <div className = "statement-item">
          My academic path has been marked by an interdisciplinary approach, merging linguistics, psychology, and computer science to explore the intricate tapestry of human cognition. 
          </div>
          <div className = "statement-item">
            I've acquired a passion for language, cognition, culture, and artificial intelligence. And I wish to pursue graduate studies to expand my knowledge.
          </div>
          <div className = "statement-item">
          I aim to create technology that is accessible, inclusive, understandable, and safe. Therefore I'm also juggling multiple initiatives and start-ups to make a positive impact in the world. 
          </div>
        </div>
    </div>

      
      
    </section>
  );
}

export default Story;
