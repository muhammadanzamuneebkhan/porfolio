/** @format */

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
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
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    gitLink: {
      type: String,
    },
    projectLink: {
      type: String,
    },
    // List of technologies used (e.g., ['JavaScript', 'Node.js', 'React'])
    technologies: {
      type: [String],
      default: [],
      required: true,
    },
    // Deployment status or link (e.g., 'Deployed to Netlify')
    deployed: {
      type: Boolean,
      default: false,
    },
    // Project banner image (with cloud storage links)
    ProjectImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    // Status of the project (e.g., "Completed", "In Progress")
    ProjectStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'], // Add 'Pending' to match frontend
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Exporting the Project model
export const ProjectModel = mongoose.model('Project', projectSchema);
