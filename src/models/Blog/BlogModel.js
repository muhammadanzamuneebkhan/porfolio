/** @format */

import mongoose from 'mongoose';
const BlogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String, // Stores Quill's formatted HTML content
      required: [true, 'Content is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencing User Model
      required: true,
    },
    tags: {
      type: [String], // Array of strings for tags
      default: [],
    },
    thumbnail: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const BlogModel = mongoose.model('Blog', BlogSchema);
