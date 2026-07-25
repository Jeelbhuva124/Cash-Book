import mongoose from 'mongoose';

const paymentModeSchema = new mongoose.Schema(
  {
    payment_mode: {
      type: String,
      required: [true, 'Payment mode name is required'],
      trim: true,
    },
    chalan_id: {
      type: String,
      required: [true, 'Chalan ID is required'],
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: String,
      default: 'Guest',
      trim: true,
    },
    updated_by: {
      type: String,
      default: 'Guest',
      trim: true,
    },
    user_email: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property mapping '_id' to 'id'
paymentModeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtuals serialize
paymentModeSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const PaymentMode = mongoose.model('PaymentMode', paymentModeSchema);

export default PaymentMode;
