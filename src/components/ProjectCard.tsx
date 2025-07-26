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

export default function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <motion.div className="project-card" whileHover={{ scale: 1.02 }}>
      <img src={project.image} alt={project.title} className="project-card-img" />
      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-desc">{project.description}</p>
      {project.skills && (
        <div className="project-card-tags">
          {project.skills.map((skill, idx) => (
            <span className="tag" key={idx}>{skill}</span>
          ))}
        </div>
      )}
      {project.links && (
        <div className="project-card-links">
          {project.links.map((link, idx) => (
            link.link === 'n/a' ? (
              <button className="project-card-button" key={idx} disabled>{link.name}</button>
            ) : (
              <button className="project-card-button" key={idx} onClick={() => window.open(link.link, '_blank')}>{link.name}</button>
            )
          ))}
        </div>
      )}
    </motion.div>
  );
}
