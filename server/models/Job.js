const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  salary: {
    type: Number,
    required: [true, 'Please provide a salary'],
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship'],
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);
