/** @format */

import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    // Proficiency level (e.g., from 0 to 100)
    proficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    // Skill icon (SVG or image representation)
    SkillIcon: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
export const SkillModel = mongoose.model('Skill', skillSchema);
