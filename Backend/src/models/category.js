import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: [true, 'Category name is required'],
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

// Virtual property to map '_id' to 'id'
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are serialized
categorySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
