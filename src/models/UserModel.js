/** @format */

import bcrypt from 'bcrypt';
import { createError } from 'http-errors-enhanced';
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    is_verify: {
      type: Boolean,
      default: false,
    },
    aboutMe: {
      type: String,
      required: [true, 'About me is required'],
    },
    Profile: {
      public_id: String,
      url: String,
    },
    Resume: {
      public_id: String,
      url: String,
    },
    socialLinks: {
      linkedin: String,
      facebook: String,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: [true, 'Role is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required'],
    },
    registrationDate: { type: Date, default: Date.now },
    loginHistory: [{ type: Date }],
    logoutHistory: [{ type: Date }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(createError(500, `Error hashing password: ${error.message}`));
  }
});

// Virtual field to calculate account age
UserSchema.virtual('accountAge').get(function () {
  const now = new Date();
  const years = now.getFullYear() - this.registrationDate.getFullYear();
  const months = now.getMonth() - this.registrationDate.getMonth();
  return { years, months };
});
// Model
export const UserModel =
  mongoose.models.User || mongoose.model('User', UserSchema);
