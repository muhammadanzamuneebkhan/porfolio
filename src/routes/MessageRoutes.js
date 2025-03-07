/** @format */

import express from 'express';
import { checkRole } from '../middlewares/CkeckRole.js';
import AuthCheck from '../middlewares/AuthCheck.js';
import fileUploadConfig from '../utils/fileUploaderExpress.js';
import {
  deleteMessage,
  getAllMessages,
  SendMessage,
} from '../controllers/MessageController.js';
const MessageRoutes = express.Router();
// Protected Routes
MessageRoutes.post(
  '/send',
  fileUploadConfig(),
  AuthCheck,
  checkRole(['user', 'admin']),
  SendMessage
);
MessageRoutes.delete(
  '/delete/:id',
  AuthCheck,
  checkRole(['admin']),
  deleteMessage
);
MessageRoutes.get(
  '/getmessages',
  AuthCheck,
  checkRole(['admin']),
  getAllMessages
);
export default MessageRoutes;
