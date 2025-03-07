/** @format */

import asyncHandler from 'express-async-handler';
import { createError } from 'http-errors-enhanced';
import { BlogModel } from '../models/Blog/BlogModel.js';
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../utils/CloudinaryWrapper.js';
const createBlog = asyncHandler(async (req, res, next) => {
  const { title, content, tags, isPublished } = req.body;
  if (!title || !content) {
    return next(createError(400, 'Title and content are required'));
  }
  if (!req.files || !req.files.thumbnail) {
    return next(createError(400, 'Thumbnail is required'));
  }
  const { thumbnail } = req.files;
  const uploadedImage = await uploadToCloudinary(
    thumbnail.tempFilePath,
    'BlogThumbnails'
  );
  if (!uploadedImage || !uploadedImage.public_id || !uploadedImage.secure_url) {
    return next(createError(400, 'Failed to upload thumbnail to Cloudinary'));
  }
  const newBlog = new BlogModel({
    userId: req.user._id,
    title,
    content,
    author: req.user._id,
    tags: tags ? tags.split(',') : [],
    thumbnail: {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    },
    isPublished: isPublished || false,
  });

  await newBlog.save();

  res.status(201).json({
    status: 'success',
    message: 'Blog created successfully',
    data: newBlog,
  });
});
// Get all blogs
const SearchFilterBlogs = asyncHandler(async (req, res, next) => {
  const { author, tags, isPublished } = req.query;

  // Build the filter object
  const filter = {};

  if (author) {
    filter.author = author;
  }

  // Handle tags filtering with exact matches
  if (tags) {
    const tagsArray = tags.split(',').map((tag) => tag.trim()); // Split and clean up input tags
    filter.tags = { $in: tagsArray }; // Use $in for exact matching of tags
  }

  if (isPublished) {
    filter.isPublished = isPublished === 'true';
  }

  try {
    const blogs = await BlogModel.find(filter).populate('author', 'name email');
    if (!blogs || blogs.length === 0) {
      return next(
        createError(404, 'No blogs found for the given tags or filters')
      );
    }
    res.status(200).json({
      status: 'success',
      message: 'Blogs fetched successfully',
      data: blogs,
    });
  } catch (error) {
    next(createError(500, 'Error fetching blogs: ' + error.message));
  }
});

// Get a specific blog by ID
const getBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await BlogModel.findById(id);
  if (!blog) {
    return next(createError(404, 'Blog not found'));
  }
  res.status(200).json({
    status: 'success',
    message: 'Blog fetched successfully',
    data: blog,
  });
});
const getAllBlogs = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const blogs = await BlogModel.find({ userId });
  if (!blogs || blogs.length === 0) {
    return next(createError(404, 'No blogs found'));
  }
  res.status(200).json({
    status: 'success',
    message: 'Published blogs fetched successfully',
    data: blogs,
  });
});
// Delete a blog
const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await BlogModel.findById(id);
  if (!blog) {
    return next(createError(404, 'Blog not found'));
  }
  await blog.deleteOne();
  res.status(200).json({
    status: 'success',
    message: 'Blog deleted successfully',
  });
});
const deleteallblogs = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(createError(404, 'User not found'));
  }
  await BlogModel.deleteMany({ userId });
  res.status(200).json({
    status: 'success',
    message: 'All blogs deleted successfully',
  });
});
// Update a blog
const updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;
  const { files } = req;
  // console.log(files.thumbnail);
  const userId = req.user;
  // console.log(userId);
  if (!req.files || !req.files.thumbnail) {
    return next(createError(400, 'Blog image is required'));
  }
  if (files && files.thumbnail) {
    console.log('true');
    const project = await BlogModel.findById(userId);
    console.log(project);
    if (project?.thumbnail?.public_id) {
      await deleteFromCloudinary(project.thumbnail.public_id); // Use deleteFromCloudinary to delete the previous image
    }

    const uploadedImage = await uploadToCloudinary(
      files.thumbnail.tempFilePath,
      'BlogThumbnails'
    );
    updates.thumbnail = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }
  const updatedBlog = await BlogModel.findByIdAndUpdate(id, updates, {
    new: true,
  });
  if (!updatedBlog) {
    return next(createError(404, 'Blog update failed'));
  }
  res.status(200).json({
    status: 'success',
    message: 'Blog updated successfully',
    data: updatedBlog,
  });
});
export {
  createBlog,
  getAllBlogs,
  getBlogById,
  SearchFilterBlogs,
  deleteallblogs,
  deleteBlog,
  updateBlog,
};
