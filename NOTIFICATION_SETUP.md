# 🔔 Real-Time Notification System - Setup Guide

## Features Implemented

✅ **Real-Time Notifications** with Socket.io
✅ **Notification Types**:
  - 📢 New job posted
  - 📋 Application status changed
  - 👤 New application received
  - 👀 Application reviewed

✅ **Modern LinkedIn-Style UI**
✅ **Notification Bell** with unread badge
✅ **Dropdown Notifications Panel** with full list
✅ **MongoDB Persistence**
✅ **Auto-cleanup** of 30-day-old notifications

---

## Installation Instructions

### Backend Setup

1. **Install Dependencies**:
```bash
cd server
npm install socket.io
```

2. **Update .env file**:
```
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SENDER_EMAIL=your_email@gmail.com
SENDER_NAME=Job Portal
FRONTEND_URL=http://localhost:3000
```

3. **Backend Files Created**:
   - `/models/Notification.js` - Notification MongoDB model
   - `/controllers/notificationController.js` - Notification logic
   - `/routes/notificationRoutes.js` - API routes
   - `/utils/socketSetup.js` - Socket.io configuration
   - `/utils/notificationTemplates.js` - Notification templates

### Frontend Setup

1. **Install Dependencies**:
```bash
cd client
npm install socket.io-client
```

2. **Frontend Files Created**:
   - `/components/NotificationBell.jsx` - Bell icon + dropdown
   - `/styles/NotificationBell.css` - Notification styling
   - `/context/ThemeContext.jsx` - Dark mode support
   - Updated Navbar to include NotificationBell

---

## How to Integrate Notifications

### When a Job is Posted

In `/controllers/jobController.js`, add:

```javascript
const NotificationTemplates = require('../utils/notificationTemplates');

exports.createJob = async (req, res) => {
  try {
    // ... existing job creation code ...

    const job = await Job.create({
      title, description, company, location, salary, jobType,
      postedBy: req.user._id,
    });

    // Send notification to all users
    const allUsers = await User.find({ role: 'jobseeker' });
    for (const jobSeeker of allUsers) {
      await NotificationTemplates.newJobPosted(
        {
          userId: jobSeeker._id,
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
```

### When Application Status Changes

In `/controllers/applicationController.js`, update:

```javascript
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.applicationId)
      .populate('jobId')
      .populate('applicantId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check authorization
    if (application.jobId.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Send notification to applicant
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
```

### When New Application Received

In `/controllers/applicationController.js`, add to `applyJob`:

```javascript
exports.applyJob = async (req, res) => {
  try {
    // ... existing application creation code ...

    const application = await Application.create({
      jobId, applicantId: req.user._id, resume: req.file.path,
    });

    // Get job details and recruiter
    const job = await Job.findById(jobId).populate('postedBy');
    const user = await User.findById(req.user._id);

    // Send email (existing code)
    await sendApplicationEmail(user.email, job.title, job.company, user.name);

    // Send notification to recruiter
    await NotificationTemplates.newApplicationReceived(
      {
        recruiterId: job.postedBy._id,
        applicantId: user._id,
        applicationId: application._id,
        applicantName: user.name,
        jobTitle: job.title,
      },
      req.app.locals.io,
      req.app.locals.sendNotificationToUser
    );

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## Running the Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

### Access the App
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Socket.io**: Connected automatically when user logs in

---

## Notification API Endpoints

```
GET     /api/notifications              - Get all notifications for user
PUT     /api/notifications/:id/read     - Mark single notification as read
PUT     /api/notifications/read-all     - Mark all notifications as read
DELETE  /api/notifications/:id          - Delete a notification
```

---

## Real-Time Events

### Socket Events

**Emitted from Backend to Frontend**:
```javascript
socket.emit('new_notification', {
  _id: notification._id,
  type: 'job_posted',
  title: '🆕 New Job Opportunity',
  message: 'XYZ Company posted a new position',
  icon: '📢',
  createdAt: timestamp,
  isRead: false,
});
```

**Sent from Frontend to Backend**:
```javascript
socket.emit('user_connected', userId);  // Connect user when logged in
```

---

## Design Features

✨ **Modern LinkedIn-Style Design**:
- Smooth animations and transitions
- Responsive dropdown
- Unread indicators with badge count
- Color-coded notification types
- Time-formatted "X minutes ago"
- Dark mode support

🎨 **Styling**:
- Professional gradient backgrounds
- Hover effects and transitions
- Mobile-responsive layout
- Accessibility-friendly

---

## Testing the Notifications

1. **Open 2 Browser Tabs**:
   - Tab 1: Login as Recruiter
   - Tab 2: Login as Job Seeker

2. **Test Scenarios**:
   - Tab 1: Post a new job → Tab 2: See notification bell update
   - Tab 2: Apply for job → Tab 1: See notification for new application
   - Tab 1: Change application status → Tab 2: See status update notification

3. **Check Notification Dropdown**:
   - Click bell icon to see full notification history
   - Click specific notification to mark as read
   - "Mark all as read" button

---

## Features Summary

| Feature | Status |
|---------|--------|
| Real-time notifications | ✅ |
| Socket.io integration | ✅ |
| MongoDB persistence | ✅ |
| Notification bell | ✅ |
| Dropdown panel | ✅ |
| Email notifications | ✅ |
| Pagination | ✅ |
| Dark mode | ✅ |
| Profile upload | ✅ |
| Recruiter analytics | ✅ |
| Modern UI | ✅ |

---

## Next Steps

- [ ] Add browser notifications (Push API)
- [ ] Email digest for unread notifications
- [ ] Notification preferences/settings
- [ ] Notification export (CSV)
- [ ] Advanced filtering options
- [ ] Notification templates API

All set! Your Job Portal now has a complete real-time notification system! 🎉
