import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🎫 Welcome to Booking System</h1>
        
        {isAuthenticated ? (
          <div className="home-authenticated">
            <h2>Hello, {user?.first_name || user?.username}! 👋</h2>
            <p>Ready to manage your bookings?</p>
            <Link to="/bookings" className="home-button">
              View My Bookings
            </Link>
          </div>
        ) : (
          <div className="home-guest">
            <p>Start managing your bookings efficiently</p>
            <div className="home-buttons">
              <Link to="/login" className="home-button">
                Login
              </Link>
              <Link to="/register" className="home-button home-button-outline">
                Register
              </Link>
            </div>
          </div>
        )}

        <div className="home-features">
          <div className="feature-card">
            <h3>📅 Easy Booking</h3>
            <p>Book resources quickly and efficiently</p>
          </div>
          <div className="feature-card">
            <h3>🔔 Notifications</h3>
            <p>Get notified about your bookings</p>
          </div>
          <div className="feature-card">
            <h3>👤 Profile Management</h3>
            <p>Manage your account and preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
