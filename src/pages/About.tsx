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
          My name is Mario! I used to have a bunch of stuff written here, but now I got this Exceptional Student Spotlight that the UCLA Newsroom wrote about me. I think it's pretty cool.

          </div>
          <a href="https://newsroom.ucla.edu/stories/mario-peng-lee-artificial-intelligence-safety-ucla-commencement-2024" target="_blank" rel="noreferrer">
          <div className = "statement-item"
            style={{ marginLeft: 0 }}
          >
          Read my story here!
          </div>
        </div>
    </div>

      
      
    </section>
  );
}

export default Story;
