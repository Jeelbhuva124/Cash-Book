import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import Transaction from './src/models/transaction.js';
import Cashbook from './src/models/cashbook.js';

connectDB()
  .then(async () => {
    const tx = await Transaction.findById('6aa3ccd792197f7d0c40bfc4');
    if (!tx) {
      console.log('Transaction not found');
      process.exit(0);
    }
    console.log(`Transaction chalan_id: ${tx.chalan_id}`);
    const cb = await Cashbook.findById(tx.chalan_id);
    console.log(`Cashbook exists: ${!!cb}`);
    if (cb) {
      console.log(`Cashbook name: ${cb.cashbook_name}`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
