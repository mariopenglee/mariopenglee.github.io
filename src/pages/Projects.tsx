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
    <motion.div className="page-content" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <h1
					style={{
						fontWeight: 700,
						fontSize: "2.4rem",
						marginBottom: "2.2rem",
						letterSpacing: "-0.01em",
						textAlign: "left",
						lineHeight: 1.1,
						display: "inline-block",
					}}
				>
          here's some
					{" "}
					<span
						style={{
							background:
								"linear-gradient(90deg, #007aff 0%, #b16cea 50%, #ff6bcb 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
							display: "inline-block",
						}}
					>
						magic ✨
					</span>
				</h1>
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
