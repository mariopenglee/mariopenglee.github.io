import { motion } from 'framer-motion';
import './ProjectCard.css';

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  image: string;
  skills?: string[];
  links?: { name: string; link: string }[];
}

export default function ProjectCard({ project, onClick }: { project: ProjectData, onClick: () => void }) {
  return (
    <motion.div
      className="project-card"
      whileHover={{ scale: 1.02 }}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      style={{ outline: 'none', cursor: 'pointer' }}
    >
      <img src={project.image} alt={project.title} className="project-card-img" />
      <h3 className="project-card-title">{project.title}</h3>
    </motion.div>
  );
}
