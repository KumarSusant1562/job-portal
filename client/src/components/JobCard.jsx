import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/JobCard.css';

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <h3>{job.title}</h3>
        <p className="company">{job.company}</p>
      </div>
      <div className="job-details">
        <p>
          <strong>Location:</strong> {job.location}
        </p>
        <p>
          <strong>Type:</strong> {job.jobType}
        </p>
        <p>
          <strong>Salary:</strong> ₹ {job.salary?.toLocaleString()}
        </p>
      </div>
      <p className="description">{job.description.substring(0, 100)}...</p>
      <Link to={`/jobs/${job._id}`} className="view-btn">
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
