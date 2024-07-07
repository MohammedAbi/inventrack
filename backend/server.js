// Load environment variables from .env file
const dotenv = require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Express app
const app = express();

// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    // Start the server once the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // Log an error if the database connection fails
    console.error("Failed to connect to MongoDB", err);
  });
