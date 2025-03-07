/** @format */

import AsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import { createError } from 'http-errors-enhanced';
const AuthCheck = AsyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '').trim();
  // console.log('Token:', token);
  if (!token) {
    return next(createError(401, 'Invalid token'));
  }
  // Verify the token using the secret key
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  // Find the user by decoded token's _id
  // console.log('Decoded Token:', decodedToken);
  const user = await UserModel.findById(decodedToken.userId);
  // console.log('User:', user);
  if (!user) {
    return next(createError(401, 'Unauthorized'));
  }
  req.user = user;
  // Pass control to the next middleware
  next();
});
export default AuthCheck;
