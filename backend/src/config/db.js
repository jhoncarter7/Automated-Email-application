import mongoose from "mongoose";



const connectDB = async () => {

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI environment variable is not set.");
    process.exit(1); 
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Initial MongoDB connection error:", err);
    process.exit(1); 
  }
};

export default connectDB;
