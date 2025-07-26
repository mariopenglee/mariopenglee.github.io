// ProjectDetailPanel.tsx
import "./ProjectPanel.css"; // Ensure this CSS file is created for styling
import { AnimatePresence, motion } from "framer-motion";
import research from "../data/research.json";
import gamedev from "../data/gamedev.json";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type ProjectPanelProps = {
  projectId: number;
  otherProject?: boolean;
  onClose?: () => void;
};

export default function ProjectPanel({ projectId, otherProject, onClose }: ProjectPanelProps) {
  const project = otherProject ? gamedev.find((project) => project.id === projectId) : research.find((project) => project.id === projectId);
  // If no project is selected, don't render the component
  if (!project) return null;

  // Trap focus and close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && onClose) onClose();
    }
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const modalContent = (
    <AnimatePresence mode="wait">
      <motion.div
        className="project-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        // Remove flex centering, let CSS handle scroll
        style={{ position: 'fixed', inset: 0, background: 'rgba(20,22,26,0.55)', zIndex: 1000, display: 'block' }}
      >
        <motion.div
          className="project-panel animatable"
          key={projectId}
          initial={{ scale: 0.98, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.98, y: 30, opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ position: 'relative', zIndex: 1001, margin: '4vh auto' }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="project-panel-close"
            aria-label="Close project details"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
             
              fontSize: 24,
              width: 44,
              height: 44,
              borderRadius: '50%',
              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.13)',
              background: 'linear-gradient(135deg, #23242a 60%, #232f47 100%)',
              border: '1.5px solid #353545',
              color: '#eaeaf0',
              transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              cursor: 'pointer',
              outline: 'none',
              padding: 0
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#232f47';
              (e.currentTarget as HTMLButtonElement).style.color = '#7ab4ff';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px 0 rgba(0,122,255,0.10)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #23242a 60%, #232f47 100%)';
              (e.currentTarget as HTMLButtonElement).style.color = '#eaeaf0';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.13)';
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
              <path d="M6.5 6.5L15.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15.5 6.5L6.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Tags at top */}
          {project.skills && (
            <div className="project-panel-skills" style={{ marginTop: '1.2em', marginBottom: '0.7em' }}>
              {project.skills.map((skill, index) => (
                <div className="project-panel-skill" key={index}>
                  {skill}
                </div>
              ))}
            </div>
          )}
          {/* Title below tags */}
          <div className="project-panel-content" style={{paddingTop: 0}}>
            <p style={{
              fontSize: '1.7rem',
              fontWeight: 700,
              padding: 0
            }}>{project.title}</p>
          </div>
          {/* Image below title */}
          <img 
            className="project-panel-image" 
            src={project.image} 
            alt={project.title}
          /> 
          {/* Body below image */}
          <div className="project-panel-content" style={{paddingTop: 0}}>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                fontWeight: 400,
                marginTop: '0.5em',
                marginBottom: '1.5em'
              }}
            >
            {project.description}</p>
            {/* Buttons at end */}
            {project.links && (
              <div className="project-panel-links">
                {project.links.map((link, index) => (
                  link.link === "n/a" ?
                    <motion.button className="project-panel-button" key={index} disabled>
                      {link.name}
                    </motion.button>
                    :
                    <motion.button className="project-panel-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => window.open(link.link, "_blank")} key={index}>
                      {link.name}
                    </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
