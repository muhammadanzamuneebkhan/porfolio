/** @format */

import express from 'express';
import AuthCheck from '../middlewares/AuthCheck.js';
import apicache from 'apicache';
import { checkRole } from '../middlewares/CkeckRole.js';
import fileUploadConfig from '../utils/fileUploaderExpress.js';
import {
  createCertification,
  getCertifications,
  updateCertification,
  deleteCertification,
  getCertificationById,
} from '../controllers/CertificationController.js';
const cache = apicache.middleware;
const certificateRoutes = express.Router();
// Protected Routes
certificateRoutes.post(
  '/addcertificate',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  createCertification
);
certificateRoutes.get(
  '/getallcertificates',
  AuthCheck,
  checkRole('admin'),
  getCertifications
);
certificateRoutes.delete(
  '/deletecertificate/:id',
  AuthCheck,
  checkRole('admin'),
  // cache('1 minute'), // Apply caching only for GET request
  deleteCertification
);
certificateRoutes.get(
  '/getcertificate/:id',
  AuthCheck,
  checkRole('admin'),
  // cache('1 minute'), // Apply caching only for GET request
  getCertificationById
);
certificateRoutes.put(
  '/updatecertificate/:id',
  AuthCheck,
  checkRole('admin'),
  fileUploadConfig(),
  updateCertification
);
export default certificateRoutes;
