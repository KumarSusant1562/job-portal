import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import Pagination from '../components/Pagination';
import { jobAPI } from '../services/api';
import '../styles/JobListings.css';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getAllJobs({
        ...filters,
        page: pagination.currentPage,
        limit: 10,
      });
      setJobs(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.pages,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
    window.scrollTo(0, 0);
  };

  return (
    <div className="job-listings">
      <h1>🔍 Find Your Perfect Job</h1>
      <div className="listings-container">
        <div className="filter-section">
          <JobFilter onFilter={handleFilter} />
        </div>

        <div className="jobs-section">
          {loading ? (
            <p className="loading">Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <>
              <div className="jobs-count">
                Found <strong>{pagination.total}</strong> jobs
              </div>
              <div className="jobs-list">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="no-jobs">No jobs found matching your criteria</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
