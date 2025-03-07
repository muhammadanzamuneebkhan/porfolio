/** @format */

import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otp: {
      type: Number, // Use Number for OTP if it only contains digits
      required: true,
    },
    otpExpiration: {
      type: Date,
      required: true,
      index: { expires: '5m' }, // Automatically delete the document after 5 minutes
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export const OtpVerificationModel =
  mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
