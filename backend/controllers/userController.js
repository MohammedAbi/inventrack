const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the email, name, and password are provided
  if (!email || !name || !password) {
    res.status(400);
    throw new Error("All fields are required: name, email, and password.");
  }

  // Check if password length is at least 6 characters
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long.");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("This email address is already registered.");
  }

  // Create new user
  const user = await User.create({ name, email, password });

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  // Send a success response if user is created
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({ _id, name, email, photo, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Failed to register user. Please try again.");
  }
});

/**
 * Login a user
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required: email and password.");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up.");
  }

  // Check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // Log in the user if credentials are correct
  if (user && passwordIsCorrect) {
    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({ _id, name, email, photo, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password.");
  }
});

/**
 * Logout user
 * @route GET /api/users/logout
 * @access Public
 */

const logout = asyncHandler((req, res) => {
  // Send HTTP-only cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // Remove
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

/**
 * Get user data
 * @route GET /api/users/me
 * @access Private
 */

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({ _id, name, email, photo, phone, bio });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

/**
 * Get login status
 * @route GET /api/users/loggedin
 * @access Public
 */

const loginStatus = asyncHandler(async (req, res) => {
  // Retrieve token from cookies
  const token = req.cookies.token;

  // Check if token exists
  if (!token) {
    return res.json({ loggedIn: false });
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json({ loggedIn: true });
  }
  return res.json({ loggedIn: false });
});

const updateuser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  // Find the user by ID from the request
  const user = await User.findById(req.user._id);

  // Check if user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found, please signup.");
  }

  // Validate request body
  const { oldPassword, password } = req.body;

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please provide both old and new passwords.");
  }

  // Check if oldPassword matches the password in the database
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password if old password matches
  if (user && isPasswordCorrect) {
    user.password = password;

    await user.save();
    res.status(200).json({ message: "Password changed successfully." });
  } else {
    res.status(400);
    throw new Error("Old password is incorrect.");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  
});
module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateuser,
  changePassword,
  forgotPassword,
};
