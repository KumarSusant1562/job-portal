const mongoose = require('mongoose');

const connectDB = async () => {
  const fallbackLocalUri = 'mongodb://127.0.0.1:27017/job-portal';
  const configuredUri = process.env.MONGO_URI;
  const urisToTry = configuredUri ? [configuredUri, fallbackLocalUri] : [fallbackLocalUri];

  let lastError;

  for (const uri of urisToTry) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      if (uri === fallbackLocalUri && configuredUri) {
        console.warn('Using local MongoDB fallback. Check your MONGO_URI for Atlas/network issues.');
      }
      return conn;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection failed for ${uri}: ${error.message}`);
    }
  }

  throw lastError;
};

module.exports = connectDB;
