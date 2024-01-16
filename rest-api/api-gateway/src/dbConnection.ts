import mongoose from "mongoose";

let mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Dental_care_app"

const connectDB = async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected');
    } catch (error: any) {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1); 
    }
  };
  
export default connectDB



