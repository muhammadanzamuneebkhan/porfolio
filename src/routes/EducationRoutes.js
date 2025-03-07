/** @format */

import express from 'express';
import {
  createEducation,
  getEducation,
  updateEducation,
  deleteEducation,
  getEducationId,
} from '../controllers/EducationController.js';
import AuthCheck from '../middlewares/AuthCheck.js';
import { checkRole } from '../middlewares/CkeckRole.js';
const router = express.Router();
router.post('/addeducation', AuthCheck, checkRole('admin'), createEducation);
router.get('/getalleducation', AuthCheck, checkRole('admin'), getEducation);
router.get('/geteducation/:id', AuthCheck, checkRole('admin'), getEducationId);
router.put(
  '/updateeducation/:id',
  AuthCheck,
  checkRole('admin'),
  updateEducation
);
router.delete(
  '/deleteeducation/:id',
  AuthCheck,
  checkRole('admin'),
  deleteEducation
);
export default router;
