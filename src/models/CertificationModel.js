/** @format */

import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    certificationTitle: { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
    certificationLink: { type: String },
    CertificationImage: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const CertificationModel = mongoose.model(
  'Certification',
  certificationSchema
);
