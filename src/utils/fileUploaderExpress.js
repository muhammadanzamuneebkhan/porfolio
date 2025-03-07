/** @format */

import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
const fileUploadConfig = () =>
  fileUpload({
    useTempFiles: true, // Store files as temp files
    tempFileDir: path.join(__dirname, 'src', 'public', 'images'), // Specify the temp file directory
  });

export default fileUploadConfig;
