const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("Please check your MongoDB Atlas IP Whitelist settings.");
    // Don't exit process, let the server start even without DB
  }
};

module.exports = connectDB;
