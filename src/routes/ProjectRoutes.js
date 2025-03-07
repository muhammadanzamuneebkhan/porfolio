/** @format */

import express from 'express';
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  searchProjects,
  deleteAllProjects,
  getProjectById,
} from '../controllers/ProjectController.js';
import fileUploadConfig from '../utils/fileUploaderExpress.js';
import { checkRole } from '../middlewares/CkeckRole.js';
import AuthCheck from '../middlewares/AuthCheck.js';
const router = express.Router();
router.post(
  '/addproject',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  createProject
);
router.delete(
  '/deleteproject/:id',
  AuthCheck,
  checkRole('admin'),
  deleteProject
);

router.delete(
  '/deleteallprojects',
  AuthCheck,
  checkRole('admin'),
  deleteAllProjects
);
router.get('/searchprojects', AuthCheck, checkRole('admin'), searchProjects);

router.get('/getallprojects', AuthCheck, checkRole('admin'), getProjects);

router.put(
  '/updateproject/:id',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  updateProject
);
router.get('/getproject/:id', AuthCheck, checkRole('admin'), getProjectById);
export default router;
