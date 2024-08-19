// ProjectDetailPanel.tsx
import "./ProjectPanel.css"; // Ensure this CSS file is created for styling
import { AnimatePresence, motion } from "framer-motion";
import projects from "../data/projects.json";
import otherprojects from "../data/other_projects.json";

type ProjectPanelProps = {
  projectId: number;
  otherProject?: boolean;
};

export default function ProjectPanel({ projectId, otherProject }: ProjectPanelProps) {
  const project = otherProject ? otherprojects.find((project) => project.id === projectId) : projects.find((project) => project.id === projectId);
    // If no project is selected, don't render the component
    if (!project) return null;


    

    return (
              <AnimatePresence mode="wait">
              { project && (<motion.div
                    className="project-panel animatable"
                    key={projectId}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.5 }}

                >
                      
                        <img 
                        className="project-panel-image" 
                        src={project.image} 
                        alt={project.title}


                         /> 
                      <div className="project-panel-content">
                          <p
                          style={
                            {
                              padding: "0 0 0 0",
                              margin: "0 0 0 0"
                            }
                          }
                          
                          >{project.title}</p>

                      <div className="project-panel-links">
                        {project.links &&
                          project.links.map((link, index) => (
                          
                              link.link === "n/a" ?
                              <motion.button className="project-panel-button"  key={index} disabled>
                                {link.name}
                              </motion.button>
                              :
                              <motion.button className="project-panel-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => window.open(link.link, "_blank")} key={index}>
                                {link.name}
                              </motion.button>
                          
                          ))}
                      </div>

                          <p>{project.description}</p>

                      
                      {
                        project.skills &&
                          (<div className="project-panel-skills">
                            {project.skills.map((skill, index) => (
                              <div className="project-panel-skill" key={index}>
                                {skill}
                              </div>
                            ))}
                          </div>)
                      }
                    </div>
                  
                  
              </motion.div>)}
              </AnimatePresence>
  );

};
