import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import User from './src/models/user.js';
import Admin from './src/models/admin.js';

dotenv.config();
// dns.setServers(['8.8.8.8', '8.8.4.4']);

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    const userCount = await User.countDocuments({});
    const adminCount = await Admin.countDocuments({});
    console.log(`Users in DB: ${userCount}`);
    console.log(`Admins in DB: ${adminCount}`);

    const users = await User.find({}).limit(5).lean();
    console.log("Sample Users:", users);

    const admins = await Admin.find({}).limit(5).lean();
    console.log("Sample Admins:", admins);
  } catch (err) {
    console.error("Failed to connect or query:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
