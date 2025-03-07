/** @format */

import AsyncHandler from 'express-async-handler';
import { EducationModel } from '../models/EducationModel.js';
import { createError } from 'http-errors-enhanced';

// Create Education record
const createEducation = AsyncHandler(async (req, res, next) => {
  const { degreeTitle, institution, startDate, endDate, description } =
    req.body;
  const userId = req.user.id;

  if (!degreeTitle || !institution || !startDate || !description) {
    return next(createError(400, 'All fields are required'));
  }

  const newEducation = new EducationModel({
    userId,
    degreeTitle,
    institution,
    startDate,
    endDate,
    description,
  });

  const savedEducation = await newEducation.save();
  res.status(201).json({
    success: true,
    data: savedEducation,
    message: 'Add Education Successfully',
  });
});

// Get Education records
const getEducation = AsyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(createError(400, 'User ID is required'));
  }

  const educationTimeline = await EducationModel.find({ userId }).sort({
    startDate: -1,
  });

  if (!educationTimeline) {
    return next(createError(404, 'Education records not found'));
  }

  res.status(200).json({
    success: true,
    data: educationTimeline,
    message: 'Get All Education Successfully',
  });
});

// Update Education record
const updateEducation = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(createError(400, 'Education ID is required'));
  }

  const updates = req.body;
  const updatedEducation = await EducationModel.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!updatedEducation) {
    return next(createError(404, 'Education record not found'));
  }

  res.status(200).json({
    success: true,
    data: updatedEducation,
    message: 'Update Education Successfully',
  });
});
// Get Id Education records
const getEducationId = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // console.log(id);
  if (!id) {
    return next(createError(400, 'User Education ID is required'));
  }
  const educationTimeline = await EducationModel.findById(id);
  // console.log(educationTimeline);
  if (!educationTimeline) {
    return next(createError(404, 'Education records not found'));
  }
  res.status(200).json({
    success: true,
    data: educationTimeline,
    message: 'Get Education Successfully',
  });
});
// Delete Education record
const deleteEducation = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(createError(404, 'Education record not found'));
  }

  const deletedEducation = await EducationModel.findByIdAndDelete(id);

  if (!deletedEducation) {
    return res
      .status(404)
      .json({ success: false, message: 'Education record not found' });
  }

  res
    .status(200)
    .json({ success: true, message: 'Education record deleted successfully' });
});

export {
  createEducation,
  getEducation,
  updateEducation,
  deleteEducation,
  getEducationId,
};
