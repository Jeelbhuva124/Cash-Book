import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

// Force Google Public DNS to bypass network restrictions on SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;
