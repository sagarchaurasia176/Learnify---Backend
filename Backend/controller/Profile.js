const Profile = require("../model/Profile");
const User = require("../model/User");

exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth, about, contactNumber, gender } = req.body;
    const id = req.user.id; // Note: `req.user.id`, not `req.User.id`
    
    // Validation
    if (!contactNumber || !gender || !about || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found!",
      });
    }

    // Update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    // Save to the database
    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile update failed!",
      error: error.message,
    });
  }
};

// Delete account
exports.ProfileDeleteAccount = async (req, res) => {
  try {
    const id = req.user.id; // Note: `req.user.id`, not `req.User.id`

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Delete profile and user
    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User profile deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User profile deletion failed!",
      error: error.message,
    });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id; // Note: `req.user.id`, not `req.User.id`
    
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data received!",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user details!",
      error: error.message,
    });
  }
};
