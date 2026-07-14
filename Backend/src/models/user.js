import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    email_id: {
      type: String,
      required: [true, 'Email ID is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to get 'id' as a string instead of '_id' object to keep API output compatible
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Defining model name as 'user_info' and collection name specifically as 'user_info'
const User = mongoose.model('user_info', userSchema, 'user_info');

export default User;
