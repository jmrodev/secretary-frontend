import ThemeToggle from '../components/common/ThemeToggle';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* ... otros elementos del navbar ... */}
      <div className="navbar-end">
        <ThemeToggle />
        {/* ... otros elementos ... */}
      </div>
    </nav>
  );
};

export default Navbar; 