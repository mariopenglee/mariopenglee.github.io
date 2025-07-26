import { motion } from 'framer-motion';
import './Projects.css';
import research from '../data/research.json';
import gamedev from '../data/gamedev.json';
import ProjectCard, { ProjectData } from '../components/ProjectCard';

const allProjects: ProjectData[] = [...research, ...gamedev];

export default function Projects() {
  const pageVariants = {
    initial: { x: '100vw' },
    in: { x: 0 },
    out: { x: '-100vw' },
  };
  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 1 };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <section id="projects">
        {allProjects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </section>
    </motion.div>
  );
}
