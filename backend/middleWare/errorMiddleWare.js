// middleware/errorHandler.js

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Set status code to 500 if not already set
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);

  // Send JSON response with error message and stack trace (if in development)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = errorHandler;
