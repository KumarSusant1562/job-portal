const express = require('express');
const { getRecruiterAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get recruiter analytics
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterAnalytics);

module.exports = router;
