import { useLayoutEffect, useState } from "react";
import "./Projects.css";
import { motion } from "framer-motion";
import TickerItem from "../components/TickerItem";
import research from "../data/research.json";
import gamedev from "../data/gamedev.json";
import ProjectPanel from "../components/ProjectPanel";
import { gsap } from "gsap";


function Projects() {

  const [selectedId, setSelectedId] = useState(1);
  console.log(selectedId);
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
    const elements = document.querySelectorAll('.animatable');


    gsap.fromTo(elements, {
      autoAlpha: 0,
      y: 50,
    }, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".titles",
        start: "top 80%",
        end: "bottom 80%",
        // markers: true
      }
    });
  }, []);


  
  return (
    
    <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    >
      <section id="projects">
        <div className="titles">
        <p className="project-category-title">Research</p>
        <div className="ticker">
        {research.map((project) => (
        <div key={project.id.toString()}>
            <TickerItem 
                project={project} 
                key={project.id.toString()}
                setSelectedId={setSelectedId}
            />
        </div>
    ))}
        </div>
        <p className="project-category-title">Game Dev</p>
        <div className="ticker">
        {gamedev.map((project) => (
        <div key={project.id.toString()}>
            <TickerItem 
                project={project} 
                key={project.id.toString()}
                setSelectedId={setSelectedId}
            />
        </div>
    ))}
      </div>
      </div>
          <ProjectPanel
              projectId={selectedId}
              otherProject={selectedId > 10}
          />
      </section>
      
    </motion.div>
  );
}

export default Projects;
