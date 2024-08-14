const express = require("express");
const ProfileRoutes = express.Router();

const { authsCheck } = require("../middleware/authsMiddleware");
const {
  updateProfile,
  ProfileDeleteAccount,
  getUserDetails,
} = require("../controller/Profile");

// profile routes
ProfileRoutes.delete("/deleteProfile", authsCheck, ProfileDeleteAccount);
ProfileRoutes.put("/updateProfile", authsCheck, updateProfile);
ProfileRoutes.get("/getUserDetails", authsCheck, getUserDetails);

module.exports = ProfileRoutes;
