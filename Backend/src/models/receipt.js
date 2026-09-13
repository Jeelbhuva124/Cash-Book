import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true
  },
  item_title: {
    type: String,
    required: true,
    trim: true
  },
  purchase_date: {
    type: Date,
    required: true
  },
  warranty_expiry_date: {
    type: Date,
    required: false
  },
  image_url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Receipt = mongoose.model('Receipt', receiptSchema);

export default Receipt;
