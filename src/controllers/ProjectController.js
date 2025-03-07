/** @format */

import asyncHandler from 'express-async-handler';
import { createError } from 'http-errors-enhanced';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from '../utils/CloudinaryWrapper.js';
import { ProjectModel } from '../models/ProjectModel.js';
const createProject = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.ProjectImage) {
    return next(createError(400, 'Project image is required'));
  }
  const {
    title,
    description,
    gitLink,
    projectLink,
    technologies,
    deployed,
    ProjectStatus,
  } = req.body;
  const { ProjectImage } = req.files;
  if (!title || !description || !technologies) {
    return next(createError(400, 'All required fields must be provided'));
  }
  const uploadedImage = await uploadToCloudinary(
    ProjectImage.tempFilePath,
    'ProjectImages'
  );

  if (!uploadedImage || !uploadedImage.public_id || !uploadedImage.secure_url) {
    return next(
      createError(400, 'Failed to upload project image to Cloudinary')
    );
  }

  const newProject = new ProjectModel({
    userId: req.user._id,
    title,
    description,
    gitLink,
    projectLink,
    technologies: technologies ? technologies.split(',') : [],
    deployed,
    ProjectImage: {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    },
    ProjectStatus,
  });

  await newProject.save();

  res.status(201).json({
    status: 'success',
    message: 'Project created successfully',
    data: newProject,
  });
});
// Get all projects for a user
const getProjects = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const projects = await ProjectModel.find({ userId });

  if (!projects || projects.length === 0) {
    return next(createError(404, 'No projects found'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Projects fetched successfully',
    data: projects,
  });
});

// Get a single project by ID

const getProjectById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const project = await ProjectModel.findById(id);

  if (!project) {
    return next(createError(404, 'Project not found'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Project fetched successfully',
    data: project,
  });
});
// Update a project
const updateProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;
  const { files } = req;
  if (files && files.ProjectImage) {
    const project = await ProjectModel.findById(id);
    if (project?.ProjectImage?.public_id) {
      await deleteFromCloudinary(project.ProjectImage.public_id); // Use deleteFromCloudinary to delete the previous image
    }

    const uploadedImage = await uploadToCloudinary(
      files.ProjectImage.tempFilePath,
      'ProjectImages'
    );
    updates.ProjectImage = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  const updatedProject = await ProjectModel.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!updatedProject) {
    return next(createError(404, 'Project update failed'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Project updated successfully',
    data: updatedProject,
  });
});
// Delete a project
const deleteProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const project = await ProjectModel.findById(id);

  if (!project) {
    return next(createError(404, 'Project not found'));
  }

  if (project?.ProjectImage?.public_id) {
    await deleteFromCloudinary(project.ProjectImage.public_id); // Use deleteFromCloudinary to destroy the image from Cloudinary
  }

  await project.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Project deleted successfully',
  });
});
// Search projects based on query parameters
const searchProjects = asyncHandler(async (req, res, next) => {
  const { title, technologies, deployed } = req.query;

  const searchConditions = { userId: req.user._id };

  if (title) searchConditions.title = { $regex: title, $options: 'i' };
  if (technologies)
    searchConditions.technologies = { $regex: technologies, $options: 'i' };
  if (deployed) searchConditions.deployed = deployed;

  const projects = await ProjectModel.find(searchConditions);

  if (!projects || projects.length === 0) {
    return next(createError(404, 'No projects found with the given criteria'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Projects fetched successfully',
    data: projects,
  });
});
// Delete all projects for the current user
const deleteAllProjects = asyncHandler(async (req, res, next) => {
  const projects = await ProjectModel.find({ userId: req.user._id });
  if (!projects || projects.length === 0) {
    return next(createError(404, 'No projects found to delete'));
  }
  // Delete all associated images from Cloudinary
  for (const project of projects) {
    if (project.ProjectImage?.public_id) {
      await deleteFromCloudinary(project.ProjectImage.public_id);
    }
  }

  await ProjectModel.deleteMany({ userId: req.user._id });

  res.status(200).json({
    status: 'success',
    message: 'All projects deleted successfully',
  });
});

export {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  searchProjects,
  deleteAllProjects,
  getProjectById,
};
