/** @format */

import express from 'express';
import {
  deleteWork,
  getWork,
  createWork,
  updateWork,
  getWorkById,
} from '../controllers/WorkController.js';
import AuthCheck from '../middlewares/AuthCheck.js';
import { checkRole } from '../middlewares/CkeckRole.js';
const router = express.Router();
router.post('/addwork', AuthCheck, checkRole('admin'), createWork);
router.get('/getallwork', AuthCheck, checkRole('admin'), getWork);
router.get('/getwork/:id', AuthCheck, checkRole('admin'), getWorkById);
router.put('/updatework/:id', AuthCheck, checkRole('admin'), updateWork);
router.delete('/deletework/:id', AuthCheck, checkRole('admin'), deleteWork);
export default router;
