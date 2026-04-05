import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import '../styles/Analytics.css';

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getRecruiterAnalytics();
      setAnalytics(response.data.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!analytics) return <div className="error-message">No analytics data available</div>;

  return (
    <div className="analytics-container">
      <h2>📊 Analytics Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.totalJobs}</div>
            <div className="stat-label">Jobs Posted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.statusCounts.pending}</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.acceptanceRate}%</div>
            <div className="stat-label">Acceptance Rate</div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="analytics-section">
        <h3>Application Status Breakdown</h3>
        <div className="status-breakdown">
          <div className="status-item">
            <div className="status-bar">
              <div className="status-bar-fill pending"></div>
            </div>
            <div className="status-info">
              <span className="status-name">🟡 Pending</span>
              <span className="status-count">{analytics.statusCounts.pending}</span>
            </div>
          </div>

          <div className="status-item">
            <div className="status-bar">
              <div className="status-bar-fill accepted"></div>
            </div>
            <div className="status-info">
              <span className="status-name">🟢 Accepted</span>
              <span className="status-count">{analytics.statusCounts.accepted}</span>
            </div>
          </div>

          <div className="status-item">
            <div className="status-bar">
              <div className="status-bar-fill rejected"></div>
            </div>
            <div className="status-info">
              <span className="status-name">🔴 Rejected</span>
              <span className="status-count">{analytics.statusCounts.rejected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Jobs by Applications */}
      {analytics.applicationsByJob.length > 0 && (
        <div className="analytics-section">
          <h3>Top Jobs by Applications</h3>
          <div className="top-jobs-list">
            {analytics.applicationsByJob.map((job, index) => (
              <div key={index} className="top-job-item">
                <div className="rank">#{index + 1}</div>
                <div className="job-info">
                  <div className="job-title">{job.jobTitle}</div>
                  <div className="job-applications">{job.applications} applications</div>
                </div>
                <div className="applications-badge">{job.applications}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications */}
      {analytics.recentApplications.length > 0 && (
        <div className="analytics-section">
          <h3>Recent Applications</h3>
          <div className="recent-applications">
            {analytics.recentApplications.slice(0, 5).map((app) => (
              <div key={app._id} className="application-item">
                <div className="applicant-info">
                  <div className="applicant-name">{app.applicantId?.name}</div>
                  <div className="applicant-email">{app.applicantId?.email}</div>
                </div>
                <div className="application-details">
                  <span className="job-title">{app.jobId?.title}</span>
                  <span className={`status-badge status-${app.status}`}>{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterAnalytics;
