import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import User from './src/models/user.js';
import Admin from './src/models/admin.js';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function syncAdminsToUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully!");
    
    const admins = await Admin.find({});
    for (let admin of admins) {
      const existingUser = await User.findOne({ email_id: admin.email_id });
      if (!existingUser) {
        const newUser = new User({
          username: admin.name || admin.username || 'Admin User',
          email_id: admin.email_id,
          password: admin.password,
          user_role: 'admin',
          is_admin: true
        });
        await newUser.save();
        console.log(`Added ${admin.email_id} to Users table.`);
      } else {
        console.log(`${admin.email_id} already exists in Users table.`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

syncAdminsToUsers();
