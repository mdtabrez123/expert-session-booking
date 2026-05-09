const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Force IPv4 (family: 4) to fix common ECONNREFUSED DNS errors in Node 18+
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Primary MongoDB connection error: ${error.message}`);
    console.log('🔄 Attempting fallback to local MongoDB instance...');
    
    try {
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/expert-booking', {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Fallback Local MongoDB Connected: ${fallbackConn.connection.host}`);
    } catch (localError) {
      console.error(`❌ Fallback Local MongoDB connection also failed: ${localError.message}`);
      console.error('CRITICAL: Cannot start server without a database.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
