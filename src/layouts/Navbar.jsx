import ThemeToggle from '../components/common/ThemeToggle';
import Menu from '../layouts/Menu'
import '../styles/layouts/navbar.css';
import '../styles/common.css'
const Navbar = () => {
  return (
    <nav className="navbar">
      <Menu />
      <div className="navbar-end">
        <ThemeToggle />
        {/* ... otros elementos ... */}
      </div>
    </nav>
  );
};

export default Navbar; 