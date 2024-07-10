const express = require("express");

const {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateuser,
  changePassword,
  forgotPassword,
} = require("../controllers/userController");
const { protect } = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", protect, updateuser);
router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword",forgotPassword);

module.exports = router;
