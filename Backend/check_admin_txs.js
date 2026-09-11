import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import Transaction from './src/models/transaction.js';
import Cashbook from './src/models/cashbook.js';

connectDB()
  .then(async () => {
    let query = {
      is_deleted: { $ne: true },
      deleted: { $ne: true }
    };

    const transactions = await Transaction.find(query).sort({ createdAt: -1 }).limit(200).lean();
    console.log(`Transactions fetched: ${transactions.length}`);
    
    const chalanIds = [...new Set(transactions.map(t => t.chalan_id).filter(Boolean))];
    const validChalanIds = chalanIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    console.log(`validChalanIds: ${validChalanIds}`);
    
    const cashbooks = await Cashbook.find({ _id: { $in: validChalanIds } }).lean();
    console.log(`Cashbooks fetched: ${cashbooks.length}`);
    
    const cbMap = {};
    cashbooks.forEach(cb => {
      cbMap[cb._id.toString()] = {
        name: cb.cashbook_name,
        type: cb.cashbook_type || 'Normal'
      };
    });

    const validTransactions = transactions.filter(t => cbMap[t.chalan_id]);
    console.log(`Valid transactions after filter: ${validTransactions.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
