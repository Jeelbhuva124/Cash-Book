import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Transaction from './src/models/transaction.js';

const cleanDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database...");

    const res1 = await Transaction.deleteMany({ is_deleted: true });
    const res2 = await Transaction.deleteMany({ deleted: true });

    console.log(`Cleanup complete! Deleted ${res1.deletedCount + res2.deletedCount} soft-deleted transactions permanently.`);
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
};

cleanDB();
