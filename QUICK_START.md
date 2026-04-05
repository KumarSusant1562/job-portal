# QUICK START GUIDE

## Step 1: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd ../client
npm install
```

## Step 2: Set Up Environment

1. Create `.env` file in `server` directory
2. Copy content from `.env.example` and update values:
```
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

## Step 3: Ensure MongoDB is Running

Make sure MongoDB service is running on your system:
- Windows: Services > MongoDB Server
- Mac/Linux: `brew services start mongodb-community`

## Step 4: Start the Application

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
✅ Backend runs on http://localhost:5000

### Terminal 2 - Frontend Dev Server
```bash
cd client
npm run dev
```
✅ Frontend runs on http://localhost:3000

## Step 5: Access the Application

Open your browser and go to: **http://localhost:3000**

## Test the Application

### Create Test Accounts:

**Job Seeker Account:**
- Email: seeker@example.com
- Password: password123
- Role: Job Seeker

**Recruiter Account:**
- Email: recruiter@example.com
- Password: password123
- Role: Recruiter

## Features to Test

1. **Register**: Create a new account
2. **Login**: Sign in with credentials
3. **Browse Jobs** (Job Seeker):
   - Filter by location, salary, job type
   - View job details
   - Apply for jobs
   - Save jobs

4. **Post Jobs** (Recruiter):
   - Navigate to Dashboard
   - Click "Post New Job"
   - Fill in job details
   - View applications

5. **Dashboard**:
   - View applications status (Job Seeker)
   - View applicants (Recruiter)

## Troubleshooting

**Issue**: Cannot connect to MongoDB
- **Solution**: Ensure MongoDB is running (`mongod` command)

**Issue**: Port 5000 or 3000 already in use
- **Solution**: Change PORT in `.env` or close conflicting applications

**Issue**: `npm install` fails
- **Solution**: Clear npm cache (`npm cache clean --force`) and try again

**Issue**: CORS errors
- **Solution**: Ensure backend is running on port 5000 as configured

## Project Structure Overview

```
job-portal/
├── server/          # Backend (Express API)
├── client/          # Frontend (React App)
├── README.md        # Full documentation
└── QUICK_START.md   # This file
```

## API Documentation

Base URL: `http://localhost:5000/api`

### Key Routes:
- Auth: `/auth/register`, `/auth/login`
- Jobs: `/jobs`, `/jobs/:id`
- Applications: `/applications/apply`, `/applications/job/:jobId`
- Saved Jobs: `/saved-jobs`

## Build for Production

### Frontend Build:
```bash
cd client
npm run build
```

### Output: `client/dist/` - ready to deploy

## Need Help?

Refer to the main `README.md` for:
- Complete API documentation
- Database schema details
- Feature descriptions
- Deployment guide

---

**Happy Coding!** 🚀
