/** @format */
import asyncHandler from 'express-async-handler';
import { createError } from 'http-errors-enhanced';
import VerificationEmail from '../utils/Email/optVerificationEmail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
import PasswordVerificationEmail from '../utils/Email/PasswordVerificationEmail.js';
import { uploadToCloudinary } from '../utils/CloudinaryWrapper.js';
import { UserModel } from '../models/UserModel.js';
import { OtpVerificationModel } from '../models/OtpVerificationModel.js';
import { PasswordVerificationModel } from '../models/PasswordVerificationModel.js';
import updateFileField from '../utils/updateFileField.js';
const Register = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.Profile || !req.files.Resume) {
    return next(createError(400, 'Profile and Resume are required'));
  }
  const { Profile, Resume } = req.files;
  const {
    name,
    email,
    password,
    role,
    password_confirmation,
    aboutMe,
    phone,
    gender,
    socialLinks,
  } = req.body;
  if (role === 'admin') {
    // Check if an admin already exists
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (existingAdmin) {
      return next(createError(400, 'Admin already exists'));
    }
  }
  // console.log(name, email, password, password_confirmation, role);
  // Check if all required fields are provided
  if (
    !name ||
    !email ||
    !password ||
    !password_confirmation ||
    !aboutMe ||
    !phone ||
    !gender ||
    !role
  ) {
    return next(createError(400, 'All fields are required', 'Bad Request'));
  }
  // Check if password and password_confirmation match
  if (password !== password_confirmation) {
    return next(createError(400, "Password and Confirm Password don't match"));
  }
  // Check if email already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return next(createError(400, 'Email already exists'));
  }
  const ProfileUploadResponse = await uploadToCloudinary(
    Profile.tempFilePath, // Single file object
    // req.files.resume[0].tempFilePath,// multiple files upload
    'Profile'
  );
  const ResumeUploadResponse = await uploadToCloudinary(
    Resume.tempFilePath, // Single file object
    'Resume'
  );
  const user = new UserModel({
    name,
    email,
    password,
    role,
    aboutMe,
    phone,
    socialLinks: JSON.parse(socialLinks), // Parse stringified JSON
    gender,
    Profile: {
      public_id: ProfileUploadResponse.public_id,
      url: ProfileUploadResponse.secure_url,
    },
    Resume: {
      public_id: ResumeUploadResponse.public_id,
      url: ResumeUploadResponse.secure_url,
    },
  });
  await user.save();
  await VerificationEmail(req, user);
  res.status(201).json({
    status: 'success',
    message: 'Registration Success',
    user,
  });
});
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(createError(400, 'Email and OTP are required'));
  }
  const user = await UserModel.findOne({ email });
  // console.log('mY uSER:', user);
  if (!user) {
    return next(createError(400, 'User not found'));
  }
  if (user.is_verified) {
    return next(createError(400, 'Email already verified, please login'));
  }
  const emailVerification = await OtpVerificationModel.findOne({
    userId: user.id,
    otp,
  });
  // console.log('emailVerification Find Yes:', emailVerification);
  if (!emailVerification) {
    if (!user.verified) {
      // if user is not verified
      await VerificationEmail(req, user);
      return next(createError(400, 'Invalid OTP, new OTP sent to your email'));
    }
  }
  if (new Date() > new Date(OtpVerificationModel.otpExpiration)) {
    // OTP has expired
    await VerificationEmail(req, user);
    return next(
      createError(400, 'OTP has expired, new OTP sent to your email')
    );
  }
  user.is_verify = true;
  await user.save();
  // Delete email verification document
  await OtpVerificationModel.deleteMany({ userId: user._id });
  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully',
  });
});
const UserLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createError(400, 'Email and password are required'));
  }
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    return next(createError(400, 'User not found'));
  }
  if (!user.is_verify) {
    return next(createError(400, 'Email not verified'));
  }
  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    return next(createError(400, 'Invalid password'));
  }
  generateTokenAndSetCookie(res, user._id);
  // Automatically add login timestamp
  user.loginHistory.push(new Date());
  await user.save();
  res.status(200).json({
    user,
    status: 'success',
    message: 'Login successful',
    is_auth: true,
  });
});
const PasswordResetLink = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(createError(400, 'Email is required'));
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(createError(400, 'User not found'));
  }
  await PasswordVerificationEmail(req, user);
  res.status(200).json({
    status: 'success',
    message: 'Password reset link sent to your email',
  });
});
const PasswordReset = asyncHandler(async (req, res, next) => {
  const { password, password_confirmation } = req.body;
  const { id, token } = req.params;
  // const user = await UserModel.findById(id).select('+password');
  const user = await UserModel.findById(id);
  // console.log(user);
  if (!user) {
    return next(createError(400, 'User not found'));
  }
  //Verify the Password Reset Token
  jwt.verify(token, process.env.PASSWORD_RESET_TOKEN_PRIVATE_KEY);
  if (!password || !password_confirmation) {
    return next(
      createError(400, 'Password and password confirmation are required')
    );
  }
  // Check if password and password_confirmation match
  if (password !== password_confirmation) {
    return next(createError(400, "Password and Confirm Password don't match"));
  }
  // Update the user's password and save
  user.password = password; // This will trigger the `pre('save')` hook
  await user.save(); // Save the user to trigger the hook
  // Delete Password verification document
  await PasswordVerificationModel.deleteMany({ userId: user._id });
  res.status(200).json({
    status: 'success',
    message: 'Password reset successful',
  });
});
const GetCurrentAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    status: 'success',
    message: 'User profile fetched successfully',
    user,
  });
});
const getAdmin = asyncHandler(async (req, res, next) => {
  const id = '676ec46ff8475c4896cfc19c';
  const user = await UserModel.findById(id);
  res.status(200).json({
    status: 'success',
    message: 'Admin profile fetched successfully',
    user,
  });
});
const getALLUsers = asyncHandler(async (req, res, next) => {
  const users = await UserModel.find({});
  res.status(200).json({
    status: 'success',
    message: 'All users fetched successfully',
    users,
  });
});
const changePassword = asyncHandler(async (req, res, next) => {
  const { password, password_confirmation } = req.body;
  if (!password || !password_confirmation) {
    return next(
      createError(400, 'Password and password confirmation are required')
    );
  }
  if (password !== password_confirmation) {
    return next(createError(400, "Password and Confirm Password don't match"));
  }
  const user = await req.user;
  // console.log('User:', user);
  const salt = +process.env.SALT;
  const newHashPassword = await bcrypt.hash(password, salt);
  // Update user's password
  await UserModel.findByIdAndUpdate(user._id, {
    $set: { password: newHashPassword },
  });
  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});
const userLogout = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Assume `req.user` contains authenticated user data
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(createError(400, 'User not found'));
  }
  // Automatically add logout timestamp
  user.logoutHistory.push(new Date());
  await user.save();
  res.clearCookie('accessToken');
  res.clearCookie('is_auth');
  res.status(200).json({
    status: 'success',
    message: 'Logout successful',
  });
});
const updateProfile = asyncHandler(async (req, res, next) => {
  const { body, files, user: currentUser } = req;
  // Prepare the new user data from request body
  const newUserData = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    aboutMe: body.aboutMe,
    gender: body.gender,
    socialLinks: JSON.parse(body.socialLinks), // Parse stringified JSON
  };
  // Check if there are any changes in user data
  const isDataChanged = Object.keys(newUserData).some(
    (key) => newUserData[key] !== currentUser[key]
  );
  // Check if files were uploaded (Profile or Resume)
  const isFileChanged = files?.Profile || files?.Resume;

  // If there are no changes in user data or no files uploaded, skip update
  if (!isDataChanged && !isFileChanged) {
    return res.status(200).json({
      success: true,
      message: 'No changes detected.',
    });
  }
  // Update avatar if a new one is provided
  if (files?.Profile) {
    const uploadedProfile = await updateFileField(
      currentUser, // Use currentUser directly
      files.Profile,
      'Profile',
      'Profile'
    );
    newUserData.Profile = {
      public_id: uploadedProfile.public_id,
      url: uploadedProfile.secure_url,
    };
  }

  // Update resume if a new one is provided
  if (files?.Resume) {
    const uploadedResume = await updateFileField(
      currentUser, // Use currentUser directly
      files.Resume,
      'Resume',
      'Resume'
    );
    newUserData.resume = {
      public_id: uploadedResume.public_id,
      url: uploadedResume.secure_url,
    };
  }
  // Update user data in the database
  const updatedUser = await UserModel.findByIdAndUpdate(
    currentUser.id,
    newUserData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  // Check if the user was found and updated
  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found or no changes were made.',
    });
  }

  // Send response with updated user data
  res.status(200).json({
    success: true,
    message: 'Profile Updated!',
    user: updatedUser,
  });
});

export {
  Register,
  verifyEmail,
  UserLogin,
  changePassword,
  userLogout,
  PasswordResetLink,
  PasswordReset,
  GetCurrentAuthenticatedUser,
  getAdmin,
  getALLUsers,
  updateProfile,
};
