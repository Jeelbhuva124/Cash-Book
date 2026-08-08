import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required (income/expense)'],
      lowercase: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required (YYYY-MM-DD)'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Time is required (HH:MM:SS AM/PM)'],
      trim: true,
    },
    chalan_id: {
      type: String,
      required: [true, 'Chalan ID is required'],
      trim: true,
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    subcategory: {
      type: String,
      default: '',
      trim: true,
    },
    payment_mode: {
      type: String,
      default: 'Cash',
      trim: true,
    },
    remark: {
      type: String,
      default: 'Null',
      trim: true,
    },
    created_by: {
      type: String,
      default: 'Guest',
      trim: true,
    },
    user_email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to get 'id' as a string instead of '_id' object
transactionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
transactionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
