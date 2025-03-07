/** @format */

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500; // Default to 500 if no status is provided
  const response = {
    message: err.message || 'Internal Server Error', // Default message
    status,
    code: err.code || 'UNKNOWN_ERROR', // Default to 'UNKNOWN_ERROR' if no code is provided
  };
  // Send the error response
  res.status(status).json(response);
};
export default errorHandler;
