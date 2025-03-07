/** @format */

import mongoose from 'mongoose';
const PasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    PassToken: {
      type: String,
      required: true,
    },
    PassTokenExpiration: {
      type: Date,
      required: true,
      index: { expires: '5m' }, // Automatically delete the document after 5 minutes
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export const PasswordVerificationModel =
  mongoose.models.PassModel || mongoose.model('PassModel', PasswordSchema);
