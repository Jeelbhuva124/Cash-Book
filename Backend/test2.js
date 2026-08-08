import mongoose from 'mongoose';
import User from './src/models/user.js';
import Cashbook from './src/models/cashbook.js';
import Transaction from './src/models/transaction.js';

mongoose.connect('mongodb+srv://Dev_Login:DevLoginPassword@cluster0.fjcbpvx.mongodb.net/Cash-Book')
  .then(async () => {
    try {
      const users = await User.find({}).sort({ createdAt: -1 }).lean();
      const rawCashbooks = await Cashbook.find({}).sort({ createdAt: -1 }).lean();
      const allTxns = await Transaction.find({}, 'chalan_id type amount').lean();
      
      const cashbooks = rawCashbooks.map(cb => {
        const idStr = cb._id.toString();
        const cbTxns = allTxns.filter(t => t.chalan_id === idStr);
        let income = 0;
        let expense = 0;
        for (const tx of cbTxns) {
          if (tx.type === 'income') income += Number(tx.amount) || 0;
          if (tx.type === 'expense') expense += Number(tx.amount) || 0;
        }
        return {
          ...cb,
          id: idStr,
          owner_email: cb.user_email || '',
          created_at: cb.createdAt,
          total_income: income,
          total_expense: expense
        };
      });
      console.log('Success:', cashbooks.length, 'cashbooks loaded.');
      if(cashbooks.length > 0) console.log(cashbooks[0]);
    } catch (e) {
      console.error('Error:', e);
    }
    process.exit(0);
  });
