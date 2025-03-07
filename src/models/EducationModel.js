/** @format */
import mongoose from 'mongoose';
const educationTimelineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    degreeTitle: { type: String, required: true },
    institution: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);
export const EducationModel = mongoose.model(
  'Education',
  educationTimelineSchema
);
