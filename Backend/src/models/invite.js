import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    inviteeName: {
      type: String,
      trim: true,
    },
    inviterName: {
      type: String,
      trim: true,
    },
    inviterEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    inviterId: {
      type: String,
      trim: true,
    },
    cashbookName: {
      type: String,
      required: [true, 'Cashbook name is required'],
      trim: true,
    },
    permissions: {
      type: String,
      required: [true, 'Permissions are required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to get 'id' as a string instead of '_id' object
inviteSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
inviteSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Invite = mongoose.model('invite_info', inviteSchema, 'invite_info');

export default Invite;
