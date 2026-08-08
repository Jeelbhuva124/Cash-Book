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

    // Drop old unique non-sparse index on firebase_uid if it exists
    try {
      const db = mongoose.connection.db;
      await db.collection('users').dropIndex('firebase_uid_1');
      await db.collection('user_info').dropIndex('firebase_uid_1');
      console.log("Dropped old unique non-sparse firebase_uid index to allow sparse index.");
    } catch (e) {
      // Ignore if index doesn't exist yet
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;
