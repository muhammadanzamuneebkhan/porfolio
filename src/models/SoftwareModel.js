/** @format */

import mongoose from 'mongoose';
const softwareSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    SoftwareIcon: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SoftwareModel = mongoose.model('Software', softwareSchema);
