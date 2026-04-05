const express = require('express');
const { saveJob, getSavedJobs, deleteSavedJob } = require('../controllers/savedJobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Save a job
router.post('/', protect, saveJob);

// Get saved jobs for user
router.get('/:userId', protect, getSavedJobs);

// Delete saved job
router.delete('/:jobId', protect, deleteSavedJob);

module.exports = router;
