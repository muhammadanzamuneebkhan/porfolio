/** @format */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import { createError } from 'http-errors-enhanced';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file to Cloudinary
export const uploadToCloudinary = async (localFilePath, folderName) => {
  if (!localFilePath) {
    throw createError(400, 'Local file path is required');
  }

  try {
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
      resource_type: 'auto', // Automatically detects the file type (image, video, etc.)
    });

    // After successful upload, delete the local file to save space
    await fs.unlink(localFilePath);
    console.log(
      `Successfully uploaded and deleted local file: ${localFilePath}`
    );

    // Return the Cloudinary response
    return response;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);

    // Attempt to delete the local file even if the upload fails (clean up)
    try {
      await fs.unlink(localFilePath);
      console.log(
        `Temporary file deleted due to upload failure: ${localFilePath}`
      );
    } catch (unlinkError) {
      console.error('Error deleting local temp file:', unlinkError);
    }

    throw createError(400, 'Error uploading file to Cloudinary');
  }
};

// Function to delete an image from Cloudinary based on public_id
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    throw createError(400, 'Public ID is required to delete image');
  }

  try {
    // Destroy the image on Cloudinary using the public_id
    const response = await cloudinary.uploader.destroy(publicId);
    console.log(`Successfully deleted image from Cloudinary: ${publicId}`);

    return response;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw createError(400, 'Error deleting image from Cloudinary');
  }
};
