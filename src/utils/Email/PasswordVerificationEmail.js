/** @format */

import jwt from 'jsonwebtoken';
import sendEmail from './emailWrapper.js';
import asyncHandler from 'express-async-handler';
import { PasswordVerificationModel } from '../../models/PasswordVerificationModel.js';
const PasswordVerificationEmail = asyncHandler(async (req, user) => {
  const userId = user._id;
  const PassExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  // Generate a password reset token
  const passwordResetToken = jwt.sign(
    { userId },
    process.env.PASSWORD_RESET_TOKEN_PRIVATE_KEY,
    { expiresIn: '5m' }
  );
  await new PasswordVerificationModel({
    userId: user._id,
    PassToken: passwordResetToken,
    PassTokenExpiration: PassExpiration,
  }).save();
  // Create the password reset link
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${userId}/${passwordResetToken}`;

  // Send the password reset email
  await sendEmail({
    to: user.email, // Recipient email address
    subject: 'Password Reset Link',
    html: `
      <h1>Password Reset</h1>
      <p>Hello, ${user.name},</p>
      <p>We received a request to reset your password. Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset My Password</a></p>
      <p>If you did not request this, please ignore this message.</p>
      <p>Thank you!</p>
    `,
  });
});

export default PasswordVerificationEmail;
