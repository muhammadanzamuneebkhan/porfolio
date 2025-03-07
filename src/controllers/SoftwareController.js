/** @format */
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from 'express-async-handler';
import { createError } from 'http-errors-enhanced';
import { uploadToCloudinary } from '../utils/CloudinaryWrapper.js';
import { SoftwareModel } from '../models/SoftwareModel.js';

// Create a new software
const createSoftware = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.SoftwareIcon) {
    return next(createError(400, 'Software icon is required'));
  }
  const { name } = req.body;
  console.log(name);
  const { SoftwareIcon } = req.files;
  console.log(SoftwareIcon);

  if (!name) {
    return next(createError(400, 'Software name is required'));
  }

  const uploadedIcon = await uploadToCloudinary(
    SoftwareIcon.tempFilePath,
    'SoftwareIcons'
  );

  if (!uploadedIcon || !uploadedIcon.public_id || !uploadedIcon.secure_url) {
    return next(createError(400, 'Failed to upload icon to Cloudinary'));
  }

  const newSoftware = new SoftwareModel({
    name,
    userId: req.user._id,
    SoftwareIcon: {
      public_id: uploadedIcon.public_id,
      url: uploadedIcon.secure_url,
    },
  });

  await newSoftware.save();

  res.status(201).json({
    status: 'success',
    message: 'Software created successfully',
    data: newSoftware,
  });
});

// Get all software for a user
const getSoftware = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const softwareList = await SoftwareModel.find({ userId });

  if (!softwareList || softwareList.length === 0) {
    return next(createError(404, 'No software found'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Software fetched successfully',
    data: softwareList,
  });
});
const getSoftwareById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(400, 'Siftware ID is required'));
  }

  const soft = await SoftwareModel.findById(id); // Fetch specific skill by ID
  if (!soft) {
    return next(createError(404, 'Soft not found'));
  }

  res.status(200).json({
    success: true,
    message: 'soft fetched successfully',
    soft,
  });
});

// Update a software
const updateSoftware = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;
  const { files } = req;

  if (files && files.SoftwareIcon) {
    const software = await SoftwareModel.findById(id);
    if (software?.SoftwareIcon?.public_id) {
      await cloudinary.uploader.destroy(software.SoftwareIcon.public_id);
    }

    const uploadedIcon = await uploadToCloudinary(
      files.SoftwareIcon.tempFilePath,
      'SoftwareIcons'
    );

    updates.SoftwareIcon = {
      public_id: uploadedIcon.public_id,
      url: uploadedIcon.secure_url,
    };
  }

  const updatedSoftware = await SoftwareModel.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!updatedSoftware) {
    return next(createError(404, 'Software update failed'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Software updated successfully',
    data: updatedSoftware,
  });
});

// Delete a software
const deleteSoftware = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const software = await SoftwareModel.findById(id);

  if (!software) {
    return next(createError(404, 'Software not found'));
  }

  // Check if there is a SoftwareIcon and a public_id to delete from Cloudinary
  if (software?.SoftwareIcon?.public_id) {
    try {
      const result = await cloudinary.uploader.destroy(
        software.SoftwareIcon.public_id
      );
      if (result.result !== 'ok') {
        // Handle any failure to destroy the image
        return next(
          createError(500, 'Failed to delete the image from Cloudinary')
        );
      }
    } catch (error) {
      // Handle Cloudinary errors
      return next(
        createError(500, 'Error while deleting the image from Cloudinary')
      );
    }
  }
  await software.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Software deleted successfully',
  });
});

export {
  createSoftware,
  getSoftware,
  updateSoftware,
  deleteSoftware,
  getSoftwareById,
};
