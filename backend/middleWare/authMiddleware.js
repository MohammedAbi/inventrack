const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes by verifying JWT token and user authentication.
 * @function protect
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = asyncHandler(async (req, res, next) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      res.status(401); // Unauthorized status code
      throw new Error("Not authorized, please login.");
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from the token's payload and exclude the password field
    const user = await User.findById(verified.id).select("-password");

    // Check if user exists
    if (!user) {
      res.status(401); // Unauthorized status code
      throw new Error("User not found.");
    }

    // Attach the user to the request object for use in the next middleware or route handler
    req.user = user;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401); // Unauthorized status code
    throw new Error("Not authorized, please login.");
  }
});

module.exports = { protect };
