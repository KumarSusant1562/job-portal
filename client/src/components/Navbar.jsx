import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';
import '../styles/Navbar.css';

const Navbar = ({ socket }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>💼 Job Portal</span>
        </Link>

        <div className="nav-menu">
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>

          {user ? (
            <>
              {user.role === 'recruiter' ? (
                <Link to="/recruiter-dashboard" className="nav-link">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/jobseeker-dashboard" className="nav-link">
                    My Applications
                  </Link>
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </>
              )}

              <NotificationBell socket={socket} />

              <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              <div className="nav-user">
                <span>Welcome, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
