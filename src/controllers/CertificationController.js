/** @format */

import asyncHandler from 'express-async-handler';
import { createError } from 'http-errors-enhanced';
import { CertificationModel } from '../models/CertificationModel.js';
import { uploadToCloudinary } from '../utils/CloudinaryWrapper.js';

// Create a new certification
const createCertification = asyncHandler(async (req, res, next) => {
  if (!req.files && !req.files.CertificationImage) {
    return next(createError(400, 'Only one image is allowed'));
  }
  const {
    certificationTitle,
    issuingOrganization,
    startDate,
    endDate,
    description,
    certificationLink,
  } = req.body;
  const { CertificationImage } = req.files;
  //   console.log('Love :', CertificationImage.tempFilePath);

  if (
    !certificationTitle ||
    !issuingOrganization ||
    !startDate ||
    !CertificationImage
  ) {
    return next(createError(400, 'All required fields must be provided'));
  }

  const uploadedImage = await uploadToCloudinary(
    CertificationImage.tempFilePath,
    'Certifications'
  );
  if (!uploadedImage || !uploadedImage.public_id || !uploadedImage.secure_url) {
    return next(createError(400, 'Failed to upload image to Cloudinary'));
  }

  const up = {
    public_id: uploadedImage.public_id,
    url: uploadedImage.secure_url,
  };
  //   console.log('up :', up);
  const newCertification = new CertificationModel({
    userId: req.user._id, // Assuming user middleware adds user object to req
    certificationTitle,
    issuingOrganization,
    startDate,
    endDate,
    description,
    certificationLink,
    CertificationImage: {
      public_id: up.public_id,
      url: up.url,
    },
  });
  //   console.log('newCertification :', newCertification);

  await newCertification.save();

  res.status(201).json({
    status: 'success',
    message: 'Certification created successfully',
    data: newCertification,
  });
});

// Get all certifications for a user
const getCertifications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  //   console.log(userId);

  const certifications = await CertificationModel.find({ userId });

  //   console.log('Certifications :', certifications);

  if (!certifications || certifications.length === 0) {
    return next(createError(404, 'No certifications found'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Certifications fetched successfully',
    data: certifications,
  });
});
const getCertificationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // console.log(id);
  if (!id) {
    return next(createError(400, 'Cerftification ID is required'));
  }
  const Cer = await CertificationModel.findById(id);
  // console.log(Cer);
  if (!Cer) {
    return next(createError(404, 'Certi experience not found'));
  }
  res.status(200).json({
    success: true,
    message: 'Certification retrieved successfully',
    data: Cer,
  });
});
// Update a certification
const updateCertification = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Assuming certification ID is passed as a route parameter
  const updates = req.body;
  const { files } = req;
  //   console.log(files.CertificationImage);
  if (files && files.CertificationImage) {
    if (id.CertificationImage?.public_id) {
      await uploadToCloudinary.destroy(id.CertificationImage.public_id); // Destroy the previous image
    }
    const uploadedIcon = await uploadToCloudinary(
      files.CertificationImage.tempFilePath,
      'CertificationImage'
    );
    // console.log(uploadedIcon);
    updates.CertificationImage = {
      public_id: uploadedIcon.public_id,
      url: uploadedIcon.url,
    };
  }
  //   console.log(updates);
  // Update the certification in the database with the provided updates
  const updatedCertification = await CertificationModel.findByIdAndUpdate(
    id,
    updates,
    { new: true }
  );
  //   console.log(updatedCertification);
  // If no updated certification is found, return an error
  if (!updatedCertification) {
    return next(createError(404, 'Certification update failed'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Certification updated successfully',
    data: updatedCertification,
  });
});

// Delete a certification
const deleteCertification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const certification = await CertificationModel.findById(id);

  if (!certification) {
    return next(createError(404, 'Certification not found'));
  }

  await certification.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Certification deleted successfully',
  });
});

export {
  createCertification,
  getCertifications,
  updateCertification,
  deleteCertification,
  getCertificationById,
};
