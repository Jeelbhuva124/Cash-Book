const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Dev_Login:DevLoginPassword@cluster0.fjcbpvx.mongodb.net/Cash-Book').then(async () => {
  const db = mongoose.connection.db;
  const res = await db.collection('cashbooks').updateMany({ cashbook_name: 'Bhavesh Bhai' }, { $set: { cashbook_type: 'interest_based' } });
  console.log('Modified Count:', res.modifiedCount);
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
