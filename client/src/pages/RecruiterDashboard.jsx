import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import RecruiterAnalytics from '../components/RecruiterAnalytics';
import '../styles/Dashboard.css';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'my-jobs';

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'full-time',
  });
  const [error, setError] = useState('');
  const [selectedJobForApps, setSelectedJobForApps] = useState(null);

  useEffect(() => {
    if (section === 'my-jobs') {
      fetchRecruiterJobs();
    } else if (section === 'applications') {
      initializeApplicationsSection();
    }
  }, [section]);

  const fetchRecruiterJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getRecruiterJobs();
      setJobs(response.data.data);
    } catch (error) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const initializeApplicationsSection = async () => {
    setLoading(true);
    try {
      const jobsResponse = await jobAPI.getRecruiterJobs();
      const recruiterJobs = jobsResponse.data.data || [];
      setJobs(recruiterJobs);

      if (recruiterJobs.length > 0) {
        const defaultJobId = recruiterJobs[0]._id;
        setSelectedJobForApps(defaultJobId);
        await fetchApplicationsForJob(defaultJobId);
      } else {
        setSelectedJobForApps(null);
        setApplications([]);
      }
    } catch (error) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsForJob = async (jobId) => {
    if (!jobId) {
      setApplications([]);
      return;
    }

    const response = await applicationAPI.getJobApplications(jobId);
    setApplications(response.data.data || []);
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await jobAPI.createJob(newJob);
      setNewJob({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'full-time',
      });
      alert('Job posted successfully!');
      fetchRecruiterJobs();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(jobId);
        fetchRecruiterJobs();
      } catch (error) {
        setError('Failed to delete job');
      }
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );
    } catch (error) {
      setError('Failed to update application status');
    }
  };

  const handleJobChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard">
      <DashboardSidebar userRole="recruiter" />

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {section === 'my-jobs' && (
          <div className="section">
            <div className="section-header">
              <h2>My Jobs</h2>
              <a href="/recruiter-dashboard?section=post-job" className="post-job-btn">
                ➕ Post New Job
              </a>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : jobs.length > 0 ? (
              <div className="jobs-list">
                {jobs.map((job) => (
                  <div key={job._id} className="job-item">
                    <div>
                      <h3>{job.title}</h3>
                      <p>{job.company} - {job.location}</p>
                      <p>Type: {job.jobType} | Salary: ₹ {job.salary?.toLocaleString()}</p>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-jobs-container">
                <p>No jobs posted yet</p>
                <a href="/recruiter-dashboard?section=post-job" className="post-job-btn">
                  ➕ Post Your First Job
                </a>
              </div>
            )}
          </div>
        )}

        {section === 'applications' && (
          <div className="section">
            <h2>Applications</h2>
            <div>
              <label>Select Job:</label>
              <select
                value={selectedJobForApps || ''}
                onChange={(e) => {
                  const jobId = e.target.value || null;
                  setSelectedJobForApps(jobId);
                  setLoading(true);
                  fetchApplicationsForJob(jobId)
                    .catch(() => setError('Failed to fetch applications'))
                    .finally(() => setLoading(false));
                }}
              >
                <option value="">Choose a job</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : applications.length > 0 ? (
              <div className="applications-list">
                {applications.map((app) => (
                  <div key={app._id} className="application-item">
                    <div>
                      <h4>{app.applicantId?.name}</h4>
                      <p>Email: {app.applicantId?.email}</p>
                      <p>Status: <strong>{app.status}</strong></p>
                    </div>
                    <div className="status-buttons">
                      {app.status !== 'accepted' && (
                        <button
                          className="accept-btn"
                          onClick={() => handleUpdateStatus(app._id, 'accepted')}
                        >
                          Accept
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          className="reject-btn"
                          onClick={() => handleUpdateStatus(app._id, 'rejected')}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No applications yet</p>
            )}
          </div>
        )}

        {section === 'post-job' && (
          <div className="section">
            <h2>Post a New Job</h2>
            <form onSubmit={handlePostJob} className="job-form">
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleJobChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={newJob.company}
                  onChange={handleJobChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newJob.location}
                  onChange={handleJobChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={newJob.salary}
                  onChange={handleJobChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Type</label>
                <select name="jobType" value={newJob.jobType} onChange={handleJobChange}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newJob.description}
                  onChange={handleJobChange}
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit">Post Job</button>
            </form>
          </div>
        )}

        {section === 'analytics' && <RecruiterAnalytics />}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
