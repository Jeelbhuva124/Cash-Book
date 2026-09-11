import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import Transaction from './src/models/transaction.js';

connectDB()
  .then(async () => {
    // Delete all transactions with amount 200000
    const res = await Transaction.deleteMany({ amount: 200000 });
    console.log(`Deleted ${res.deletedCount} transactions with amount 200000`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
