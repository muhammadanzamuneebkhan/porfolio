/** @format */

import express from 'express';
import {
  changePassword,
  getAdmin,
  getALLUsers,
  GetCurrentAuthenticatedUser,
  PasswordReset,
  PasswordResetLink,
  Register,
  updateProfile,
  UserLogin,
  userLogout,
  verifyEmail,
} from '../controllers/UserController.js';
import AuthCheck from '../middlewares/AuthCheck.js';
import { checkRole } from '../middlewares/CkeckRole.js';
import fileUploadConfig from '../utils/fileUploaderExpress.js';
const userRoutes = express.Router();
// Public Routes
userRoutes.post('/register', fileUploadConfig(), Register);
userRoutes.post('/verify-email', verifyEmail);
userRoutes.post('/login', UserLogin);
userRoutes.post('/reset-password-link', PasswordResetLink);
userRoutes.post('/reset-password/:id/:token', PasswordReset);
// Protected Routes
userRoutes.get(
  '/getcurentauthuser',
  AuthCheck,
  checkRole('admin'),
  GetCurrentAuthenticatedUser
);
userRoutes.get('/getadmin', AuthCheck, checkRole('admin'), getAdmin);
userRoutes.get('/getallusers', AuthCheck, checkRole('admin'), getALLUsers);
userRoutes.put(
  '/change-password',
  AuthCheck,
  checkRole('admin'),
  changePassword
);
userRoutes.put(
  '/getadmin/profile/update',
  fileUploadConfig(),
  AuthCheck,
  checkRole('admin'),
  updateProfile
);
userRoutes.post('/logout', AuthCheck, checkRole(['user', 'admin']), userLogout);
export default userRoutes;
