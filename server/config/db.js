const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    
    try {
      const User = conn.connection.collection('users');
      await User.dropIndex('userName_1');
      console.log('Dropped obsolete userName_1 index');
    } catch (indexError) {
      if (indexError.code !== 27) { 
        console.log('userName_1 index does not exist or already dropped');
      }
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

