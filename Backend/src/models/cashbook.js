import mongoose from 'mongoose';

const cashbookSchema = new mongoose.Schema(
  {
    cashbook_name: {
      type: String,
      required: [true, 'Cashbook name is required'],
      trim: true,
    },
    cashbook_type: {
      type: String,
      enum: ['regular', 'interest_based'],
      default: 'regular',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    hex_code: {
      type: String,
      default: '#8B5CF6',
      trim: true,
    },
    user_email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    user_id: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to get 'id' as a string instead of '_id' object
cashbookSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
cashbookSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Cashbook = mongoose.model('Cashbook', cashbookSchema);

export default Cashbook;
