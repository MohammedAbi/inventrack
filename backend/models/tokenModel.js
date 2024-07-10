const mongoose = require("mongoose");

// Define the token schema
const tokenSchema = mongoose.Schema({
  // Reference to the user
  userId: {
    type: String,
    required: true,
    ref: "user",
  },
  // Token value
  token: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // Token creation date
  createdAt: {
    type: Date,
    default: Date.now, // Added default value for creation date
  },
  // Token expiration date
  expiresAt: {
    type: Date,
  },
});

// Create the Token model
const Token = mongoose.model("Token", tokenSchema);

// Export the Token model
module.exports = Token;
