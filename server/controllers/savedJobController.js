const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save a job
// @route   POST /api/saved-jobs
// @access  Private
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Please provide job ID' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already saved
    let savedJob = await SavedJob.findOne({ jobId, userId: req.user._id });
    if (savedJob) {
      return res.status(400).json({ success: false, message: 'Job already saved' });
    }

    // Save job
    savedJob = await SavedJob.create({
      jobId,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: savedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved jobs for user
// @route   GET /api/saved-jobs/:userId
// @access  Private
exports.getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.params.userId })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: savedJobs.length, data: savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private
exports.deleteSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({ jobId: req.params.jobId, userId: req.user._id });

    if (!savedJob) {
      return res.status(404).json({ success: false, message: 'Saved job not found' });
    }

    await SavedJob.findByIdAndDelete(savedJob._id);

    res.status(200).json({ success: true, message: 'Job removed from saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
