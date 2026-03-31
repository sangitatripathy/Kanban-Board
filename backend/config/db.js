import mongoose from 'mongoose';
import dns from "node:dns/promises";

dns.setServers([
  "1.1.1.1", 
  "8.8.8.8"  
]);

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI,{})
    console.log("MongoDB connected successfully");
  }
  catch(error){
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;