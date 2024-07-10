const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    // User's name
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    // User's email
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      // Regular expression to validate email format
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    // User's password
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      // maxlength: [23, "Password must not exceed 23 characters"], // This is optional
    },
    // User's profile photo
    photo: {
      type: String,
      default: "https://i.ibb.co/4pDNk1/avatar.png",
    },
    // User's phone number
    phone: {
      type: String,
      default: "+234",
    },
    // User's bio
    bio: {
      type: String,
      maxlength: [250, "Bio must not exceed 250 characters"],
      default: "bio",
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
