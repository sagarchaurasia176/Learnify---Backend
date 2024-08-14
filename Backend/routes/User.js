const express = require("express");
const {
  otpSendToTheClient,
  signup,
  login,
  changePassword,
} = require("../controller/Auth");

// userRoutes for login
const UserRoutes = express.Router();

const {
  resetPasswordToken,
  resetPasswords,
} = require("../controller/ResetPassword");
//middleware
const { authsCheck } = require("../middleware/authsMiddleware");
// routes for
//  user login
UserRoutes.post("/login", login);
//SINGUP
UserRoutes.post("/singup", signup);
//send otp
// UserRoutes.post("/sendOtp", sendOtp);
//change passwrod
UserRoutes.post("/changePassword", authsCheck, changePassword);

// GEnerate the password token
UserRoutes.post("/reset-password", resetPasswordToken);
//reset the users password after verification
UserRoutes.post("/reset-password", resetPasswords);
//reset password

module.exports = UserRoutes;
