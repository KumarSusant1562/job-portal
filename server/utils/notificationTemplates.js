const { createNotification } = require('../controllers/notificationController');

// Notification templates
const NotificationTemplates = {
  // When a new job is posted
  newJobPosted: async (jobData, recruiterId, io, sendNotificationToUser) => {
    const notification = await createNotification({
      userId: jobData.userId, // Job seeker user
      type: 'job_posted',
      title: '🆕 New Job Opportunity',
      message: `${jobData.companyName} posted a new "${jobData.jobTitle}" position`,
      icon: '📢',
      relatedUserId: recruiterId,
      relatedId: jobData.jobId,
      link: `/jobs/${jobData.jobId}`,
    });

    if (io && sendNotificationToUser) {
      sendNotificationToUser(jobData.userId, notification);
    }
    return notification;
  },

  // When application status changes
  applicationStatusChanged: async (applicationData, io, sendNotificationToUser) => {
    const statusMessages = {
      accepted: '✅ Your application was accepted! Great news!',
      rejected: '❌ Your application status updated',
      pending: '⏳ Your application is being reviewed',
    };

    const notification = await createNotification({
      userId: applicationData.applicantId,
      type: 'application_status',
      title: '📋 Application Update',
      message: statusMessages[applicationData.status],
      icon: applicationData.status === 'accepted' ? '✅' : '❌',
      relatedUserId: applicationData.recruiterId,
      relatedId: applicationData.applicationId,
      link: `/jobseeker-dashboard`,
    });

    if (io && sendNotificationToUser) {
      sendNotificationToUser(applicationData.applicantId, notification);
    }
    return notification;
  },

  // When recruiter receives a new application
  newApplicationReceived: async (applicationData, io, sendNotificationToUser) => {
    const notification = await createNotification({
      userId: applicationData.recruiterId,
      type: 'new_application',
      title: '👤 New Application Received',
      message: `${applicationData.applicantName} applied for "${applicationData.jobTitle}"`,
      icon: '📝',
      relatedUserId: applicationData.applicantId,
      relatedId: applicationData.applicationId,
      link: `/recruiter-dashboard?section=applications`,
    });

    if (io && sendNotificationToUser) {
      sendNotificationToUser(applicationData.recruiterId, notification);
    }
    return notification;
  },

  // When recruiter reviews an application
  recruiterReviewedApplication: async (applicationData, io, sendNotificationToUser) => {
    const notification = await createNotification({
      userId: applicationData.applicantId,
      type: 'application_status',
      title: '👀 Your Application was Reviewed',
      message: `${applicationData.recruiterName} from ${applicationData.companyName} reviewed your application`,
      icon: '👀',
      relatedUserId: applicationData.recruiterId,
      relatedId: applicationData.applicationId,
      link: `/jobseeker-dashboard`,
    });

    if (io && sendNotificationToUser) {
      sendNotificationToUser(applicationData.applicantId, notification);
    }
    return notification;
  },
};

module.exports = NotificationTemplates;
