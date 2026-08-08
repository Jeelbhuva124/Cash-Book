import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebase_uid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email_id: {
      type: String,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    user_role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    is_admin: {
      type: Boolean,
      default: false,
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
      type: String, // Store Base64 or URL
      default: '',
    },
    security_pin: {
      type: String,
      default: '1234',
    }
  },
  {
    timestamps: true,
    strict: true, // Strips out any un-defined fluff sent from frontend
  }
);

userSchema.pre('save', function (next) {
  if (this.email_id && !this.email) {
    this.email = this.email_id;
  }
  if (this.email && !this.email_id) {
    this.email_id = this.email;
  }
  if (!this.email && !this.email_id) {
    return next(new Error('Email or Email ID is required'));
  }
  if (this.username && !this.name) {
    this.name = this.username;
  }
  if (this.name && !this.username) {
    this.username = this.name;
  }
  next();
});

// Virtual property to get 'id' string
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema, 'user_info');
export default User;
