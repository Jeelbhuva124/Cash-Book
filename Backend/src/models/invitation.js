import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    invite_name: {
      type: String,
      trim: true,
    },
    inviter_email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    inviter_id: {
      type: String,
      trim: true,
    },
    cashbook_name: {
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
invitationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
invitationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Invitation = mongoose.model('invite_info', invitationSchema, 'invite_info');

export default Invitation;
