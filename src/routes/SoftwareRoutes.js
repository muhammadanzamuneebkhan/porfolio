/** @format */

import express from 'express';
import {
  createSoftware,
  getSoftware,
  updateSoftware,
  deleteSoftware,
  getSoftwareById,
} from '../controllers/SoftwareController.js';
import AuthCheck from '../middlewares/AuthCheck.js';
import apicache from 'apicache';
import { checkRole } from '../middlewares/CkeckRole.js';
import fileUploadConfig from '../utils/fileUploaderExpress.js';
const router = express.Router();
const cache = apicache.middleware;
router.post(
  '/addsoftware',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  createSoftware
);
router.get(
  '/getallsoftware',
  AuthCheck,
  checkRole('admin'),
  // cache('60 seconds'),
  getSoftware
);
router.get(
  '/getsoftware/:id',
  AuthCheck,
  checkRole('admin'),
  // cache('60 seconds'),
  getSoftwareById
);
router.put(
  '/updatesoftware/:id',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  updateSoftware
);
router.delete(
  '/deletesoftware/:id',
  AuthCheck,
  checkRole('admin'),
  deleteSoftware
);

export default router;
