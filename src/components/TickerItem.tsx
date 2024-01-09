
import './TickerItem.css';
import { motion } from "framer-motion";

type TickerItemProps = {
    project: {
        id: number;
        title: string;
    };
    setSelectedId: (id: number) => void;
};
export default function TickerItem({ project, setSelectedId }: TickerItemProps) {
    const hoverStyle = {
        scale: 1.1, // Scale up the component to 110% of its size
        transition: {
            type: "spring", // Use a spring animation for a smooth effect
            stiffness: 300, // Adjust the stiffness of the spring for more/less bounciness
        }
    };

    return (
        
        <motion.div
            className="ticker-item animatable"
            key={project.id}
            onClick={() => setSelectedId(project.id)}
            whileHover={hoverStyle}
        >
            <span>{project.title}</span>
        </motion.div>
    );
}
