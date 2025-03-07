/** @format */

import asyncHandler from 'express-async-handler';
import { createError } from 'http-errors-enhanced';
import { messageModel } from '../models/MessageModel.js';
import { uploadToCloudinary } from '../utils/CloudinaryWrapper.js';
const SendMessage = asyncHandler(async (req, res, next) => {
  const { user: currentUser } = req;
  const userId = currentUser._id;
  console.log(userId);
  if (!req.files || !req.files.ProjectFile) {
    return next(createError(400, 'Project file is required'));
  }
  const { ProjectFile } = req.files;
  const { senderName, subject, message, senderPhoneNumber } = req.body;
  if (!message || !senderName || !subject || !senderPhoneNumber) {
    return next(createError(400, 'All fields are required'));
  }
  const Project = await uploadToCloudinary(
    ProjectFile.tempFilePath, // Single file object
    // req.files.resume[0].tempFilePath,// multiple files upload
    'ProjectData'
  );
  const user = new messageModel({
    userId,
    senderName,
    subject,
    message,
    senderPhoneNumber,
    ProjectFile: {
      public_id: Project.public_id,
      url: Project.secure_url,
    },
  });
  await user.save();
  res.status(201).json({
    status: 'success',
    message: 'Message Sent Successfully',
    user,
  });
});
const deleteMessage = asyncHandler(async (req, res, next) => {
  // console.log(req.params);
  const { id } = req.params;
  // console.log(id);
  const message = await messageModel.findById(id);
  if (!message) {
    return next(createError(404, 'Message not found'));
  }
  await messageModel.deleteOne();
  res.status(201).json({
    success: true,
    message: 'Message Deleted',
  });
});
const getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await messageModel.find({});
  res.status(200).json({
    status: 'success',
    message: 'All Messages fetched successfully',
    messages,
  });
});
export { SendMessage, deleteMessage, getAllMessages };
