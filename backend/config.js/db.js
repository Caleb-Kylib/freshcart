const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 15000, // 15 seconds timeout for server selection
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 15000, // 15 seconds connection timeout
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
      appName: 'FreshCart'
    };

    console.log("🔗 Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB Connected Successfully");
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("\n⚠️  Troubleshooting steps:");
    console.error("1. Check if your IP address (102.0.8.198) is whitelisted in MongoDB Atlas");
    console.error("2. Go to MongoDB Atlas → Security → Network Access → Add IP Address");
    console.error("3. Add your current IP: 102.0.8.198");
    console.error("4. Or use 0.0.0.0/0 to allow all IPs (development only)");
    console.error("5. Verify your internet connection");
    console.error("6. Check if MongoDB Atlas cluster is running");
    
    // Don't exit process, let the server start even without DB
    // The server will work with limited functionality
  }
};

module.exports = connectDB;
