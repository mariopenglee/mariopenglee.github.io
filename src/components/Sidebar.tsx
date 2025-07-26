import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="profile">
        <img src="/harmony.png" alt="Profile" className="profile-img" />
        <h1 className="profile-name">Mario Peng Lee</h1>
        <p className="profile-tagline">AI Engineer</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/">About</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </aside>
  );
}
