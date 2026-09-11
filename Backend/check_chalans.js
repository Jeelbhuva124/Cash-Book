import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import Transaction from './src/models/transaction.js';

connectDB()
  .then(async () => {
    const txs = await Transaction.find().lean();
    console.log(`Total transactions: ${txs.length}`);
    const chalanIds = [...new Set(txs.map(t => t.chalan_id).filter(Boolean))];
    console.log(`Chalan IDs:`, chalanIds);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
