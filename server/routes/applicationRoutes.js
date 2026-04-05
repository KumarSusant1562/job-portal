const express = require('express');
const {
  applyJob,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Job seeker applies for job
router.post('/apply', protect, authorize('jobseeker'), upload.single('resume'), applyJob);

// Recruiter gets applications for their job
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);

// Get user's applications
router.get('/user/:userId', protect, getUserApplications);

// Update application status
router.put('/:applicationId/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
