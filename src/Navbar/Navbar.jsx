import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Navbar.css';
 
function NavBar() {
 
  return (
    <header>
    <nav className="navbar-container">
        <h2 className='logo'>Anime</h2>
      
      <section className="link-container">
        <Link className='link' to="/">Home</Link>
        <Link className='link' to="/">About</Link>
        <Link className='link' to="/">Services</Link>
        <Link className='link' to="/">Contact</Link>
      </section>
      <section className='icons-container'>
    <FontAwesomeIcon 
        icon={faGithub} 
        className="icon"
        size="2x"
        onClick={() => window.open('https://github.com/Sweodin', '_blank')} 
        style={{ cursor: 'pointer' }}
    />
    <FontAwesomeIcon 
    icon={faLinkedin} 
    className="icon"
    size="2x"
    onClick={() => window.open('https://linkedin.com/in/peter-gustafsson-3206a8108', '_blank')} 
    style={{ cursor: 'pointer' }}
/>
    <FontAwesomeIcon 
        icon={faInstagram} 
        className="icon"
        size="2x"
        onClick={() => window.open('https://instagram.com/peter_gus85', '_blank')} 
        style={{ cursor: 'pointer' }}
    />
</section>
    </nav>
  </header>
  );
}
 
export default NavBar;