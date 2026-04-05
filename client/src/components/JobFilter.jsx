import React, { useState } from 'react';
import '../styles/JobFilter.css';

const JobFilter = ({ onFilter }) => {
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');

  const handleFilter = () => {
    onFilter({ location, jobType, salary });
  };

  const clearFilters = () => {
    setLocation('');
    setJobType('');
    setSalary('');
    onFilter({});
  };

  return (
    <div className="job-filter">
      <h3>Filter Jobs</h3>
      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          placeholder="Search by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Job Type</label>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Minimum Salary</label>
        <input
          type="number"
          placeholder="Minimum salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
      </div>

      <div className="filter-buttons">
        <button className="apply-btn" onClick={handleFilter}>
          Apply Filters
        </button>
        <button className="clear-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default JobFilter;
