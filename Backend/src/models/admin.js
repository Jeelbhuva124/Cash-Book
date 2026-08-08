import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    user_role: {
      type: String,
      default: 'admin',
    },
    is_admin: {
      type: Boolean,
      default: true,
    },
    account_status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    phone_number: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    security_pin: {
      type: String,
      default: '1234',
    }
  },
  {
    timestamps: true,
  }
);

// Map the _id field to id
adminSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
