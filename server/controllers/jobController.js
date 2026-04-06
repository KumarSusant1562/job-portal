const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const NotificationTemplates = require('../utils/notificationTemplates');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType } = req.body;

    // Validate input
    if (!title || !description || !company || !location || !salary || !jobType) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      postedBy: req.user._id,
    });

    // Send notifications to all job seekers
    const allJobSeekers = await User.find({ role: 'jobseeker' });
    for (const seeker of allJobSeekers) {
      await NotificationTemplates.newJobPosted(
        {
          userId: seeker._id,
          jobId: job._id,
          jobTitle: job.title,
          companyName: job.company,
        },
        req.user._id,
        req.app.locals.io,
        req.app.locals.sendNotificationToUser
      );
    }

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs with filters and pagination
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res) => {
  try {
    const { location, title, salary, jobType, page = 1, limit = 10 } = req.query;

    // Build filter object
    let filter = {};
    if (location) filter.location = new RegExp(location, 'i'); // Case-insensitive search
    if (title) filter.title = new RegExp(title, 'i'); // Case-insensitive search
    if (jobType) filter.jobType = jobType;
    if (salary) filter.salary = { $gte: parseInt(salary) };

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    // Get jobs with pagination
    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email company');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if user is the job owner
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if user is the job owner
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    // Delete associated applications
    await Application.deleteMany({ jobId: req.params.id });
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get jobs posted by recruiter
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter only)
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id });

    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get search suggestions for job titles and locations
// @route   GET /api/jobs/search/suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 1) {
      return res.status(200).json({ success: true, data: { titles: [], locations: [] } });
    }

    // Create a regex pattern for case-insensitive partial matching
    const searchPattern = new RegExp(query, 'i');

    // Get unique job titles that match the search
    const titleSuggestions = await Job.aggregate([
      {
        $match: {
          title: searchPattern,
        },
      },
      {
        $group: {
          _id: '$title',
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          title: '$_id',
        },
      },
    ]);

    // Get unique locations that match the search
    const locationSuggestions = await Job.aggregate([
      {
        $match: {
          location: searchPattern,
        },
      },
      {
        $group: {
          _id: '$location',
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          location: '$_id',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        titles: titleSuggestions.map((s) => s.title),
        locations: locationSuggestions.map((s) => s.location),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
