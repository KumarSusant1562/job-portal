import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardSidebar.css';

const DashboardSidebar = ({ userRole }) => {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul className="sidebar-menu">
        {userRole === 'recruiter' ? (
          <>
            <li>
              <Link to="/recruiter-dashboard">My Jobs</Link>
            </li>
            <li>
              <Link to="/recruiter-dashboard?section=applications">Applications</Link>
            </li>
            <li>
              <Link to="/recruiter-dashboard?section=analytics">📊 Analytics</Link>
            </li>
            <li>
              <Link to="/recruiter-dashboard?section=post-job">Post New Job</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/jobseeker-dashboard">My Applications</Link>
            </li>
            <li>
              <Link to="/jobseeker-dashboard?section=saved-jobs">Saved Jobs</Link>
            </li>
            <li>
              <Link to="/jobs">Browse Jobs</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default DashboardSidebar;
