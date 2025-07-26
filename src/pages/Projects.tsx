import { motion } from 'framer-motion';
import './Projects.css';
import research from '../data/research.json';
import gamedev from '../data/gamedev.json';
import ProjectCard, { ProjectData } from '../components/ProjectCard';
import { useState } from 'react';
import ProjectPanel from '../components/ProjectPanel';

const allProjects: ProjectData[] = [...research, ...gamedev];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [otherProject, setOtherProject] = useState(false);

  const handleCardClick = (project: ProjectData) => {
    setSelectedProject(project);
    setOtherProject(gamedev.some(p => p.id === project.id));
  };

  const closePanel = () => setSelectedProject(null);

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
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <section id="projects">
        {allProjects.map((project) => (
          <ProjectCard project={project} key={project.id} onClick={() => handleCardClick(project)} />
        ))}
      </section>
      {selectedProject && (
        <ProjectPanel projectId={selectedProject.id} otherProject={otherProject} onClose={closePanel} />
      )}
    </motion.div>
  );
}
