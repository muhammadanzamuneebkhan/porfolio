/** @format */

import express from 'express';
import AuthCheck from '../middlewares/AuthCheck.js';
import apicache from 'apicache';
import { checkRole } from '../middlewares/CkeckRole.js';
import fileUploadConfig from '../utils/fileUploaderExpress.js';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  SearchFilterBlogs,
  deleteallblogs,
  deleteBlog,
  updateBlog,
} from '../controllers/BlogController.js';
const cache = apicache.middleware;
const BlogRoutes = express.Router();
// Protected Routes
BlogRoutes.post(
  '/addblog',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  createBlog
);
// BlogRoutes.get('/getallblogs', cache('60 second'), AuthCheck, getAllBlogs);
BlogRoutes.get('/getallblogs', AuthCheck, getAllBlogs);
BlogRoutes.get('/getblog/:id', AuthCheck, checkRole('admin'), getBlogById);

BlogRoutes.get(
  '/searchblogs',
  AuthCheck,
  checkRole('admin'),
  SearchFilterBlogs
);
BlogRoutes.delete('/deleteblog/:id', AuthCheck, checkRole('admin'), deleteBlog);
BlogRoutes.delete(
  '/deleteallblogs',
  AuthCheck,
  checkRole('admin'),
  deleteallblogs
);
BlogRoutes.put(
  '/updateblog/:id',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  updateBlog
);

export default BlogRoutes;
