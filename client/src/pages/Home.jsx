import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { AuthContext } from '../context/AuthContext';
import { jobAPI } from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  const fetchLatestJobs = async () => {
    try {
      const response = await jobAPI.getAllJobs({ limit: 6 });
      setLatestJobs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJobClick = () => {
    if (user && user.role === 'recruiter') {
      // User is already logged in as recruiter, go to dashboard
      navigate('/recruiter-dashboard');
    } else if (user && user.role === 'jobseeker') {
      // User is logged in as jobseeker, show alert
      alert('Please log in as a recruiter to post a job. You can switch roles when you create a new account.');
      navigate('/register?role=recruiter');
    } else {
      // User is not logged in, go to register page
      navigate('/register?role=recruiter');
    }
  };

  const handleGetStartedClick = () => {
    if (user && user.role === 'jobseeker') {
      // User is already logged in as jobseeker, go to dashboard
      navigate('/jobseeker-dashboard');
    } else if (user && user.role === 'recruiter') {
      // User is logged in as recruiter, go to recruiter dashboard
      navigate('/recruiter-dashboard');
    } else {
      // User is not logged in, go to register page
      navigate('/register');
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Next Opportunity</h1>
          <p>Discover thousands of job listings tailored to your skills and interests</p>
          <div className="hero-actions">
            <Link to="/jobs" className="hero-btn primary">
              🔍 Browse Jobs
            </Link>
            <button onClick={handlePostJobClick} className="hero-btn secondary">
              📢 Post a Job
            </button>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="latest-jobs">
        <div className="section-header">
          <div>
            <h2>🔥 Latest Jobs</h2>
            <p className="section-subtitle">Find trending opportunities posted recently</p>
          </div>
          <Link to="/jobs" className="view-all-link">
            View All Jobs →
          </Link>
        </div>
        {loading ? (
          <p className="loading-text">Loading jobs...</p>
        ) : latestJobs.length > 0 ? (
          <div className="jobs-grid">
            {latestJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="no-jobs-text">No jobs available at the moment</p>
        )}
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-value">10K+</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">5K+</div>
          <div className="stat-label">Companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">50K+</div>
          <div className="stat-label">Job Seekers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">100%</div>
          <div className="stat-label">Free Platform</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Matching</h3>
            <p>Find jobs that perfectly match your skills and career goals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Quick Apply</h3>
            <p>Apply to jobs in seconds with your saved resume</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Instant Notifications</h3>
            <p>Get alerts for new jobs and application updates</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Career Growth</h3>
            <p>Access resources and insights for career development</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Opportunities</h3>
            <p>Find jobs from companies around the world</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Trusted Companies</h3>
            <p>Explore jobs from verified and reputable employers</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of professionals finding their dream jobs</p>
          <button onClick={handleGetStartedClick} className="cta-btn">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
