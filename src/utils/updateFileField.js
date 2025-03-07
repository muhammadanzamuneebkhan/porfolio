/** @format */

import { uploadToCloudinary } from './CloudinaryWrapper.js';
import { v2 as cloudinary } from 'cloudinary';
// Function to update file fields in the user profile (e.g., Avatar or Resume)
const updateFileField = async (user, file, field, folderName) => {
  const oldFileId = user[field]?.public_id;

  // Delete old file from Cloudinary if it exists
  if (oldFileId) {
    await cloudinary.uploader.destroy(oldFileId);
  }

  // Upload the new file to Cloudinary
  return uploadToCloudinary(file.tempFilePath, folderName);
};
export default updateFileField;
