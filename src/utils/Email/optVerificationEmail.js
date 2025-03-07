/** @format */

import { OtpVerificationModel } from '../../models/OtpVerificationModel.js';
import sendEmail from './emailWrapper.js';
import { generateOTP } from './generateOTP.js';

const VerificationEmail = async (req, user) => {
  console.log('user:', user._id);
  const otp = generateOTP(4);
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  // Save OTP in Database
  await new OtpVerificationModel({
    userId: user._id,
    otp: otp,
    otpExpiration: otpExpiration,
  }).save();
  await sendEmail({
    to: user.email, // Recipient email address
    subject: 'OTP - Verify your account',
    html: `
     <h1>Email Verification</h1>
    <p>Hello,Dear ${user.name}</p>
    <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
    <h2>Your OTP: ${otp}</h2>
    <p>If you did not request this, please ignore this message.</p>
    <p>Thank you!</p>
  `,
  });
  return otp;
};

export default VerificationEmail;
