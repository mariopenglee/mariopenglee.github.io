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
      gsap.set(element, { opacity: 0.2, scale: 0.98, y: 40 });
      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => gsap.to(element, { opacity: 1, scale: 1.03, y: 0, duration: 0.7, ease: "power3.out" }),
        onLeave: () => gsap.to(element, { opacity: 0.2, scale: 0.98, y: 40, duration: 0.7, ease: "power3.inOut" }),
        onEnterBack: () => gsap.to(element, { opacity: 1, scale: 1.03, y: 0, duration: 0.7, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(element, { opacity: 0.2, scale: 0.98, y: 40, duration: 0.7, ease: "power3.inOut" }),
        markers: false,
        scrub: true,
      });
    });
  }, []);

  return (
    <motion.div className="page-content">
      <section id="about">
        <motion.div
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
        />
        <div className = "statement">
          <div className = "statement-list">
            <div className = "statement-item" style={{ marginLeft: 0 }}>
              👋 I'm an engineer who loves solving problems and connecting with people. 
            </div>
            <div className = "statement-item">
              🌎 My passion is making technology accessible, inclusive, and safe for everyone. I'm always working on projects and startups to create a positive impact.
            </div>
            <div className = "statement-item">
              🎓 I recently graduated from UCLA, where I studied Linguistics, Computer Science, and Psychology. I also researched AI safety and ethics—read
              {' '}
              <a href="https://newsroom.ucla.edu/stories/mario-peng-lee-artificial-intelligence-safety-ucla-commencement-2024">this article</a>
              {' '}to learn more about my journey!
            </div>
            <div className = "statement-item">
              🤖 Now, I'm an AI Engineer at <a href="https://nexos.ai/">nexos.ai</a>, leading the agentic team and building the future of intelligent systems.
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Story;
