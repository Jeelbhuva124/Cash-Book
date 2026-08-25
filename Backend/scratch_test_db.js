import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import User from './src/models/user.js';
import Admin from './src/models/admin.js';

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully!");
    
    const users = await User.find({}, 'email_id');
    console.log(`Users in DB:`, users.map(u => u.email_id));
    const admins = await Admin.find({}, 'email_id');
    console.log(`Admins in DB:`, admins.map(a => a.email_id));
  } catch (err) {
    console.error("Failed to connect directly:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
