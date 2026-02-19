import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/bookings" className="navbar-brand">
          🎫 Booking System
        </Link>

        <div className="navbar-menu">
          <Link to="/bookings" className="navbar-link">
            My Bookings
          </Link>
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
          <div className="navbar-user">
            <span>{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
