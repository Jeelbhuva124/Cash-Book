import mongoose from 'mongoose';
import Cashbook from './src/models/cashbook.js';

mongoose.connect('mongodb://127.0.0.1:27017/cashbook')
  .then(async () => {
    const cashbooks = await Cashbook.find({});
    console.log(cashbooks);
    process.exit(0);
  });
