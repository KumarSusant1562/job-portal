import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';
import '../styles/Navbar.css';

const Navbar = ({ socket }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>💼 Job Portal</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/jobs" className="nav-link" onClick={handleNavClick}>
            Jobs
          </Link>

          {user ? (
            <>
              {user.role === 'recruiter' ? (
                <Link to="/recruiter-dashboard" className="nav-link" onClick={handleNavClick}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/jobseeker-dashboard" className="nav-link" onClick={handleNavClick}>
                    My Applications
                  </Link>
                  <Link to="/profile" className="nav-link" onClick={handleNavClick}>
                    Profile
                  </Link>
                </>
              )}

              <NotificationBell socket={socket} />

              <button
                className="theme-toggle"
                onClick={() => {
                  toggleTheme();
                  handleNavClick();
                }}
                title="Toggle dark mode"
              >
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
              <button
                className="theme-toggle"
                onClick={() => {
                  toggleTheme();
                  handleNavClick();
                }}
                title="Toggle dark mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className="nav-link" onClick={handleNavClick}>
                Login
              </Link>
              <Link to="/register" className="nav-link signup" onClick={handleNavClick}>
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
