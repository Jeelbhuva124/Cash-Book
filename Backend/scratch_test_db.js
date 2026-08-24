import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import User from './src/models/user.js';
import Admin from './src/models/admin.js';

dotenv.config();

// Try standard connection string targeting the shards directly with SSL enabled
const directUri = "mongodb://Dev_Login:DevLoginPassword@ac-eszqwyh-shard-00-00.fjcbpvx.mongodb.net:27017,ac-eszqwyh-shard-00-01.fjcbpvx.mongodb.net:27017,ac-eszqwyh-shard-00-02.fjcbpvx.mongodb.net:27017/Cash-Book?ssl=true&authSource=admin&replicaSet=atlas-u6n69-shard-0";

async function test() {
  try {
    console.log("Attempting direct connection to Atlas shards...");
    await mongoose.connect(directUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Connected to MongoDB successfully!");
    
    const userCount = await User.countDocuments({});
    const adminCount = await Admin.countDocuments({});
    console.log(`Users in DB: ${userCount}`);
    console.log(`Admins in DB: ${adminCount}`);
  } catch (err) {
    console.error("Failed to connect directly:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
