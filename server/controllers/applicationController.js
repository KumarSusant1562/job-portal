const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendApplicationEmail } = require('../utils/emailService');
const NotificationTemplates = require('../utils/notificationTemplates');

// @desc    Apply for a job
// @route   POST /api/applications/apply
// @access  Private (Job seeker only)
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Please provide job ID' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already applied
    let application = await Application.findOne({ jobId, applicantId: req.user._id });
    if (application) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Create application
    application = await Application.create({
      jobId,
      applicantId: req.user._id,
      resume: req.file.path,
    });

    // Send confirmation email
    const user = await User.findById(req.user._id);
    await sendApplicationEmail(user.email, job.title, job.company, user.name);

    // Notify recruiter about new application
    await NotificationTemplates.newApplicationReceived(
      {
        recruiterId: job.postedBy,
        applicantId: user._id,
        applicationId: application._id,
        applicantName: user.name,
        jobTitle: job.title,
      },
      req.app.locals.io,
      req.app.locals.sendNotificationToUser
    );

    res.status(201).json({ success: true, data: application, message: 'Application submitted. Check your email for confirmation!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if user is the job owner
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view applications' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('applicantId', 'name email')
      .populate('jobId', 'title company');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/user/:userId
// @access  Private
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.params.userId })
      .populate('jobId', 'title company location salary jobType')
      .populate('applicantId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (Recruiter)
// @route   PUT /api/applications/:applicationId/status
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.applicationId).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check if user is the job owner
    if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    // Notify applicant about status change
    await NotificationTemplates.applicationStatusChanged(
      {
        applicantId: application.applicantId,
        recruiterId: req.user._id,
        applicationId: application._id,
        status: status,
      },
      req.app.locals.io,
      req.app.locals.sendNotificationToUser
    );

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
