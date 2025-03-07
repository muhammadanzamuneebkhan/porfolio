/** @format */

import AsyncHandler from 'express-async-handler';
import { WorkModel } from '../models/WorkModel.js';
import { createError } from 'http-errors-enhanced';
const createWork = AsyncHandler(async (req, res, next) => {
  const { companyName, role, startDate, endDate, description } = req.body;
  const userId = req.user.id;
  if (!companyName || !role || !startDate || !description | !endDate) {
    return next(createError(400, 'All fields are required'));
  }
  const newWorkExperience = new WorkModel({
    userId,
    companyName,
    role,
    startDate,
    endDate,
    description,
  });
  const savedWorkExperience = await newWorkExperience.save();
  res.status(201).json({
    success: true,
    message: 'Work created successfully',
    data: savedWorkExperience,
  });
});
const getWork = AsyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(createError(400, 'User ID is required'));
  }
  const workExperiences = await WorkModel.find({ userId }).sort({
    startDate: -1,
  });
  if (!workExperiences) {
    return next(createError(404, 'Work experience not found'));
  }
  res.status(200).json({
    success: true,
    message: 'Works Get successfully',
    data: workExperiences,
  });
});
const getWorkById = AsyncHandler(async (req, res, next) => {
  // console.log('Request Params:', req.params); // Debugging step
  const { id } = req.params;
  // console.log(id);
  if (!id) {
    return next(createError(400, 'Work ID is required'));
  }
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return next(createError(400, 'Invalid Work ID'));
  // }

  // Fetch Work experience by ID (Ensure id is passed as a string, not an object)
  const work = await WorkModel.findById(id);
  // console.log(work);
  if (!work) {
    return next(createError(404, 'Work experience not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Work retrieved successfully',
    data: work,
  });
});

const updateWork = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(400, 'Work ID is required'));
  }
  const updates = req.body;
  const updatedWorkExperience = await WorkModel.findByIdAndUpdate(id, updates, {
    new: true,
  });
  if (!updatedWorkExperience) {
    return next(createError(404, 'Work experience not found'));
  }
  res.status(200).json({
    success: true,
    message: 'Works Updated successfully',
    data: updatedWorkExperience,
  });
});
const deleteWork = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(404, 'Work experience not found'));
  }
  const deletedWorkExperience = await WorkModel.findByIdAndDelete(id);
  if (!deletedWorkExperience) {
    return res
      .status(404)
      .json({ success: false, message: 'Work experience not found' });
  }
  res
    .status(200)
    .json({ success: true, message: 'Work experience deleted successfully' });
});
export { deleteWork, getWork, createWork, updateWork, getWorkById };
