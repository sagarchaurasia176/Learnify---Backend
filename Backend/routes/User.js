const express = require("express");
const UserRoutes = express.Router();
const {
    sendOtp,
    singup,
    login,
    changePassword,
} = require("../controller/Auth");
// reset password token generatre
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
UserRoutes.post("/singup", singup);
//send otp
UserRoutes.post("/sendOtp", sendOtp);
//change passwrod
UserRoutes.post("/changePassword", authsCheck, changePassword);

// GEnerate the password token
UserRoutes.post("/reset-password", resetPasswordToken);
//reset the users password after verification
UserRoutes.post("/reset-password", resetPasswords);
//reset password

module.exports = UserRoutes;
