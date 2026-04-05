import React, { useState } from 'react';
import { applicationAPI } from '../services/api';
import '../styles/ApplyForm.css';

const ApplyForm = ({ jobId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a resume file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('resume', file);

      await applicationAPI.applyJob(formData);
      setFile(null);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="apply-form" onSubmit={handleSubmit}>
      <h3>Apply for Job</h3>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Upload Resume (PDF/DOC)</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Applying...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default ApplyForm;
