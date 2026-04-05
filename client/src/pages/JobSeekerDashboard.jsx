import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationAPI, savedJobAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import JobCard from '../components/JobCard';
import '../styles/Dashboard.css';

const JobSeekerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'applications';

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (section === 'applications') {
        fetchApplications();
      } else if (section === 'saved-jobs') {
        fetchSavedJobs();
      }
    }
  }, [section, user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationAPI.getUserApplications(user._id);
      setApplications(response.data.data);
    } catch (error) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const response = await savedJobAPI.getSavedJobs(user._id);
      setSavedJobs(response.data.data);
    } catch (error) {
      setError('Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSavedJob = async (jobId) => {
    try {
      await savedJobAPI.deleteSavedJob(jobId);
      setSavedJobs((prev) => prev.filter((job) => job.jobId._id !== jobId));
    } catch (error) {
      setError('Failed to delete saved job');
    }
  };

  return (
    <div className="dashboard">
      <DashboardSidebar userRole="jobseeker" />

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {section === 'applications' && (
          <div className="section">
            <h2>My Applications</h2>
            {loading ? (
              <p>Loading...</p>
            ) : applications.length > 0 ? (
              <div className="applications-list">
                {applications.map((app) => (
                  <div key={app._id} className="application-item">
                    <div>
                      <h3>{app.jobId?.title}</h3>
                      <p>Company: {app.jobId?.company}</p>
                      <p>Location: {app.jobId?.location}</p>
                      <p>Status: <strong className={`status-${app.status}`}>{app.status}</strong></p>
                      <p>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>You haven't applied to any jobs yet</p>
            )}
          </div>
        )}

        {section === 'saved-jobs' && (
          <div className="section">
            <h2>Saved Jobs</h2>
            {loading ? (
              <p>Loading...</p>
            ) : savedJobs.length > 0 ? (
              <div className="saved-jobs-grid">
                {savedJobs.map((savedJob) => (
                  <div key={savedJob._id} className="saved-job-card">
                    <JobCard job={savedJob.jobId} />
                    <button
                      className="remove-btn"
                      onClick={() => handleDeleteSavedJob(savedJob.jobId._id)}
                    >
                      Remove from Saved
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>You haven't saved any jobs yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
