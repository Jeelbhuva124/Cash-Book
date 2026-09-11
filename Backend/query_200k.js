import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import Transaction from './src/models/transaction.js';

connectDB()
  .then(async () => {
    const txs = await Transaction.find({ amount: 200000 });
    console.log(`Found ${txs.length} transactions with amount 200000`);
    txs.forEach(tx => console.log(tx._id, tx.title, tx.type, tx.amount, tx.is_deleted, tx.deleted));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
