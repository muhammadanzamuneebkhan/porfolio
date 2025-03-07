/** @format */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
// Get the absolute path equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const result = dotenv.config({
  path: path.join(__dirname, '../../.env'),
});
// console.log(result);
// if (result.error) {
//   console.error('Error loading .env file:', result.error);
// } else {
//   console.log('Environment variables loaded:', result.parsed);
// }
if (!process.env.PORT || !process.env.MONGO_URL) {
  console.error('Please provide PORT and MONGO_URL in the .env file');
}
