import mongoose from 'mongoose';

const emiSubscriptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    due_date: {
      type: String,
      required: [true, 'Due date is required (YYYY-MM-DD)'],
      trim: true,
    },
    start_date: {
      type: String,
      default: '',
      trim: true,
    },
    end_date: {
      type: String,
      default: '',
      trim: true,
    },
    last_paid_date: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      enum: ['EMI', 'Subscription'],
      required: [true, 'Type is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active',
      trim: true,
    },
    chalan_id: {
      type: String,
      default: '1',
      trim: true,
    },
    created_by: {
      type: String,
      default: 'System',
      trim: true,
    },
    user_email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to get 'id' as a string instead of '_id' object
emiSubscriptionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
emiSubscriptionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const EmiSubscription = mongoose.model('EmiSubscription', emiSubscriptionSchema);

export default EmiSubscription;
