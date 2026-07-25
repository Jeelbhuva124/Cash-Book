import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    subcategory_name: {
      type: String,
      required: [true, 'Subcategory name is required'],
      trim: true,
    },
    category_id: {
      type: String,
      required: [true, 'Parent Category ID is required'],
      trim: true,
    },
    category_name: {
      type: String,
      required: [true, 'Parent Category name is required'],
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
subcategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtuals serialize
subcategorySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

export default Subcategory;
