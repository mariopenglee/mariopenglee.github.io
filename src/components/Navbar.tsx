// Navbar component
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import your CSS
import { motion } from 'framer-motion';


export default function Navbar () {



    return (
        <nav className="navbar">
          <motion.div 
          className="navbar-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="navbar-item"
              whileTap={{ scale: 1.2}}
              >
              <Link to="/">
                About
                </Link>
            </motion.div>
            <motion.div
              className="navbar-item"
              whileTap={{ scale: 1.2}}
              >
            <Link to="/projects">Projects</Link>
            </motion.div>
            <motion.div
              className="navbar-item"
              whileTap={{ scale: 1.2}}
              >
            <Link to="/contact">Contact</Link>
            </motion.div>
          </motion.div>
        </nav>
    );
};
