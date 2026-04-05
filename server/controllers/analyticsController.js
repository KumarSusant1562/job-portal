const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get recruiter analytics
// @route   GET /api/analytics/recruiter
// @access  Private (Recruiter only)
exports.getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Get total jobs posted
    const totalJobs = await Job.countDocuments({ postedBy: recruiterId });

    // Get all applications for recruiter's jobs
    const recruiterJobs = await Job.find({ postedBy: recruiterId }).select('_id');
    const jobIds = recruiterJobs.map(job => job._id);

    const allApplications = await Application.find({ jobId: { $in: jobIds } });
    const totalApplications = allApplications.length;

    // Count applications by status
    const statusCounts = {
      pending: allApplications.filter(app => app.status === 'pending').length,
      accepted: allApplications.filter(app => app.status === 'accepted').length,
      rejected: allApplications.filter(app => app.status === 'rejected').length,
    };

    // Get applications per job (top jobs)
    const applicationsByJob = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'job',
        },
      },
    ]);

    // Acceptance rate
    const acceptanceRate =
      totalApplications > 0
        ? Math.round((statusCounts.accepted / totalApplications) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        statusCounts,
        acceptanceRate,
        applicationsByJob: applicationsByJob.map(item => ({
          jobTitle: item.job[0]?.title,
          applications: item.count,
        })),
        recentApplications: await Application.find({ jobId: { $in: jobIds } })
          .populate('applicantId', 'name email')
          .populate('jobId', 'title')
          .sort({ createdAt: -1 })
          .limit(10),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
