/** @format */

import express from 'express';
import AuthCheck from '../middlewares/AuthCheck.js';
import { checkRole } from '../middlewares/CkeckRole.js';
import fileUploadConfig from '../utils/fileUploaderExpress.js';
import {
  updateSkill,
  createSkill,
  deleteSkill,
  getSkills,
  getSkillById,
} from '../controllers/SkillController.js';
const skillRoutes = express.Router();
// Protected Routes
skillRoutes.post(
  '/addskill',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  createSkill
);
skillRoutes.get('/getallskills', AuthCheck, checkRole('admin'), getSkills);
skillRoutes.delete(
  '/deleteskill/:id',
  AuthCheck,
  checkRole('admin'),
  deleteSkill
);
skillRoutes.put(
  '/updateskill/:id',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  updateSkill
);
skillRoutes.get('/getskill/:id', AuthCheck, checkRole('admin'), getSkillById);
export default skillRoutes;
