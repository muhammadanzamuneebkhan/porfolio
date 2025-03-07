/** @format */

// export const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit OTP
// };
import { v4 as uuidv4 } from 'uuid';
export const generateOTP = (length) => {
  if (length !== 4 && length !== 6) {
    throw new Error('OTP length must be 4 or 6.');
  }
  return uuidv4().replace(/\D/g, '').slice(0, length);
};
