# Job Portal System - MERN Stack Application

A complete full-stack Job Portal web application built with the MERN (MongoDB, Express, React, Node.js) stack. This platform allows recruiters to post jobs and job seekers to search, apply, and save jobs.

## Features

### For Job Seekers
- 🔍 Search and filter jobs by location, salary, and job type
- 📝 Apply for jobs with resume uploads
- 💾 Save favorite jobs for later
- 📊 Track application status
- 👤 View applied jobs history

### For Recruiters
- 📢 Post and manage job listings
- 🗂️ View and manage applications
- ✅ Accept/Reject applicants
- 📋 Access to all applicant resume

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication token
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Styling

## Project Structure

```
job-portal/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── savedJobController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── SavedJob.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── savedJobRoutes.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobFilter.jsx
│   │   │   ├── ApplyForm.jsx
│   │   │   ├── DashboardSidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── JobListings.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   └── JobSeekerDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── Navbar.css
│   │   │   ├── JobCard.css
│   │   │   ├── JobFilter.css
│   │   │   ├── Auth.css
│   │   │   ├── Home.css
│   │   │   ├── JobListings.css
│   │   │   ├── JobDetails.css
│   │   │   ├── ApplyForm.css
│   │   │   ├── Dashboard.css
│   │   │   └── DashboardSidebar.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

5. Make sure MongoDB is running, then start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (Recruiter only)
- `PUT /api/jobs/:id` - Update job (Recruiter only)
- `DELETE /api/jobs/:id` - Delete job (Recruiter only)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications/apply` - Apply for job (Job Seeker only)
- `GET /api/applications/job/:jobId` - Get job applications (Recruiter only)
- `GET /api/applications/user/:userId` - Get user's applications
- `PUT /api/applications/:applicationId/status` - Update application status

### Saved Jobs
- `POST /api/saved-jobs` - Save a job
- `GET /api/saved-jobs/:userId` - Get user's saved jobs
- `DELETE /api/saved-jobs/:jobId` - Remove saved job

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: enum ['jobseeker', 'recruiter'],
  createdAt: Date
}
```

### Job
```javascript
{
  title: String,
  description: String,
  company: String,
  location: String,
  salary: Number,
  jobType: enum ['full-time', 'part-time', 'internship'],
  postedBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Application
```javascript
{
  jobId: ObjectId (ref: Job),
  applicantId: ObjectId (ref: User),
  resume: String (file path),
  status: enum ['pending', 'accepted', 'rejected'],
  createdAt: Date
}
```

### SavedJob
```javascript
{
  userId: ObjectId (ref: User),
  jobId: ObjectId (ref: Job),
  createdAt: Date
}
```

## Features in Detail

### User Authentication
- User registration with role selection (Job Seeker or Recruiter)
- Secure login with JWT token
- Token stored in localStorage for persistent sessions
- Protected routes based on user roles

### Job Management
- Filter jobs by location, salary range, and job type
- View detailed job information
- Post new jobs (Recruiter)
- Edit and delete jobs (Recruiter)
- Search functionality

### Application System
- Apply for jobs with resume upload
- View application status
- Recruiters can accept/reject applications
- Prevent duplicate applications

### Saved Jobs
- Save favorite jobs
- View saved jobs in dashboard
- Remove from saved list

### Responsive Design
- Mobile-friendly interface
- Tablet optimized layouts
- Desktop enhanced experience

## Usage

### For Job Seekers
1. Register with email and password
2. Browse available jobs with filters
3. View job details
4. Apply for jobs with resume upload
5. Track application status
6. Save favorite jobs

### For Recruiters
1. Register as a recruiter
2. Post jobs with details
3. View applications for each job
4. Accept or reject applications
5. Edit or delete job postings

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

## Error Handling
- Comprehensive error messages for API failures
- Form validation on both frontend and backend
- Protected routes with authentication checks
- File upload validation for resume

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation
- File type validation for uploads
- CORS enabled for cross-origin requests

## Future Enhancements
- Email notifications
- Advanced search with pagination
- User profile management
- Skill-based job matching
- Interview scheduling
- Rating and reviews system
- Social media integration
- Admin dashboard

## Troubleshooting

### MongoDB Connection Error
Ensure MongoDB is running on your system:
```bash
mongod
```

### Port Already in Use
Change the PORT in `.env` file to an available port.

### CORS Issues
Check that the frontend proxy is configured correctly in `vite.config.js` and matches your backend URL.

### Multer Upload Issues
Ensure the `uploads` directory exists in the server folder and has write permissions.

## License
This project is open source and available for educational purposes.

## Authors
- Full Stack Developer

## Support
For issues or questions, please create an issue in the repository.

---

Happy coding! 🚀
