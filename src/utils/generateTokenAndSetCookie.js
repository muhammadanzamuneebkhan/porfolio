/** @format */

import jwt from 'jsonwebtoken';
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie('is_auth', true, {
    httpOnly: false,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
export default generateTokenAndSetCookie;
