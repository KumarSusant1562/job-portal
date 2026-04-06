const express = require('express');
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getSearchSuggestions,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Search suggestions - must come before generic routes to avoid conflicts
router.get('/search/suggestions', getSearchSuggestions);

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes - must come after search/suggestions
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);
router.get('/recruiter/my-jobs', protect, authorize('recruiter'), getRecruiterJobs);

module.exports = router;
