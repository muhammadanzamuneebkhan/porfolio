/** @format */

import './config/variables.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/UserRoutes.js';
import errorHandler from './config/GlobalErrorHandler.js';
import MessageRoutes from './routes/MessageRoutes.js';
import skillRoutes from './routes/SkillRoutes.js';
import WorkRoutes from './routes/WorkRoutes.js';
import EducationRoutes from './routes/EducationRoutes.js';
import apicache from 'apicache';
import certificateRoutes from './routes/CertificateRoutes.js';
import SoftwareRoutes from './routes/SoftwareRoutes.js';
import ProjectRoutes from './routes/ProjectRoutes.js';
import BlogRoutes from './routes/BlogRoutes.js';
export const app = express();
// Initialize apicache
const cache = apicache.middleware;
const corsOptions = {
  origin: [
    'https://effortless-pony-db3ed5.netlify.app',
    'https://gleeful-bonbon-1d1abf.netlify.app',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
//Nesscessary Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// // Apply apicache globally (default cache duration: 5 minutes)
// app.use(cache('5 minutes'));
// Load Routes
app.use('/api/user', userRoutes);
app.use('/api/message', MessageRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/work', WorkRoutes);
app.use('/api/education', EducationRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/software', SoftwareRoutes);
app.use('/api/project', ProjectRoutes);
app.use('/api/blog', BlogRoutes);
// Global error middleware
app.use(errorHandler);
export default app;
