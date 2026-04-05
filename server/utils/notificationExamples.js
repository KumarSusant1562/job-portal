// This file shows how to integrate notifications into your existing controllers
// Copy and paste these modifications into your controllers

// ============ EXAMPLE 1: Notify when job is posted ============
// Add this to jobController.js in the createJob function:

/*
const NotificationTemplates = require('../utils/notificationTemplates');

exports.createJob = async (req, res) => {
  try {
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
    const User = require('../models/User');
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
*/

// ============ EXAMPLE 2: Notify when application is submitted ============
// Add this to applicationController.js in the applyJob function:

/*
const NotificationTemplates = require('../utils/notificationTemplates');
const { sendApplicationEmail } = require('../utils/emailService');

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Please provide job ID' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    let application = await Application.findOne({ jobId, applicantId: req.user._id });
    if (application) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    application = await Application.create({
      jobId,
      applicantId: req.user._id,
      resume: req.file.path,
    });

    const user = await User.findById(req.user._id);
    const recruiter = await User.findById(job.postedBy);

    // Send confirmation email to applicant
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

    // Notify applicant with confirmation
    await NotificationTemplates.applicationStatusChanged(
      {
        applicantId: user._id,
        recruiterId: recruiter._id,
        applicationId: application._id,
        status: 'pending',
      },
      req.app.locals.io,
      req.app.locals.sendNotificationToUser
    );

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted. Check your email for confirmation!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
*/

// ============ EXAMPLE 3: Notify when application status changes ============
// Add this to applicationController.js in the updateApplicationStatus function:

/*
const NotificationTemplates = require('../utils/notificationTemplates');

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.applicationId)
      .populate('jobId')
      .populate('applicantId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Notify applicant about status change
    await NotificationTemplates.applicationStatusChanged(
      {
        applicantId: application.applicantId._id,
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
*/

module.exports = {};
