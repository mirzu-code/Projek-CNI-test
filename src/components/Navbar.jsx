import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [hasBooking, setHasBooking] = useState(false);

  useEffect(() => {
    const checkBooking = () => {
      const activeBooking = localStorage.getItem('activeBooking');
      setHasBooking(!!activeBooking);
    };
    
    checkBooking();
    window.addEventListener('storage', checkBooking);
    return () => window.removeEventListener('storage', checkBooking);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          LEMBAYUNG
        </Link>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          <div className="dropdown">
            <Link to="/menu" className={location.pathname.startsWith('/menu') ? 'active dropbtn' : 'dropbtn'}>
              <span className="nav-icon">🍽️</span>
              <span className="dropbtn-text">Menu <span className="arrow">▼</span></span>
            </Link>
            <div className="dropdown-content">
              <Link to="/menu/malay">🇲🇾 Malay</Link>
              <Link to="/menu/chinese">🇨🇳 Chinese</Link>
              <Link to="/menu/japanese">🇯🇵 Japanese</Link>
              <Link to="/menu/western">🥩 Western</Link>
              <Link to="/menu/indian">🍛 Indian</Link>
            </div>
          </div>
          <Link to="/book" className={location.pathname === '/book' ? 'active' : ''}>
            <span className="nav-icon">📅</span>
            <span>Book</span>
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            <span className="nav-icon">ℹ️</span>
            <span>About</span>
          </Link>
          {hasBooking && (
            <Link to="/my-booking" className={location.pathname === '/my-booking' ? 'active' : ''}>
              <span className="nav-icon">🎟️</span>
              <span>Ticket</span>
            </Link>
          )}
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
            <span className="nav-icon">⚙️</span>
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
