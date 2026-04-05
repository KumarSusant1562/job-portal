import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, savedJobAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ApplyForm from '../components/ApplyForm';
import '../styles/JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobAPI.getJobById(id);
      setJob(response.data.data);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await savedJobAPI.saveJob(id);
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleApplySuccess = () => {
    setShowApplyForm(false);
    alert('Application submitted successfully!');
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (!job) return <div className="error">Job not found</div>;

  return (
    <div className="job-details">
      <div className="job-details-container">
        <div className="job-header">
          <div>
            <h1>{job.title}</h1>
            <p className="company">{job.company}</p>
          </div>
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveJob}
          >
            {isSaved ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>

        <div className="job-info">
          <div className="info-item">
            <strong>Location:</strong> {job.location}
          </div>
          <div className="info-item">
            <strong>Job Type:</strong> {job.jobType}
          </div>
          <div className="info-item">
            <strong>Salary:</strong> ₹ {job.salary?.toLocaleString()}
          </div>
          <div className="info-item">
            <strong>Posted By:</strong> {job.postedBy?.name}
          </div>
        </div>

        <div className="job-description">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>

        {user?.role === 'jobseeker' && (
          <div className="apply-section">
            {showApplyForm ? (
              <ApplyForm jobId={id} onSuccess={handleApplySuccess} />
            ) : (
              <button className="apply-btn" onClick={() => setShowApplyForm(true)}>
                Apply for Job
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
