const Otp = require("../model/Otp");
const User = require("../model/User");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../model/Profile");
const jwt = require("jsonwebtoken");

// Send OTP code
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email: email });

    // Check if the email exists
    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!",
      });
    }

    // Generate the OTP
    let otp = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure the OTP is unique
    let otpResult = await Otp.findOne({ otp: otp });
    while (otpResult) {
      otp = otpGenerator.generate(5, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      otpResult = await Otp.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    await Otp.create(otpPayload);

    // Return the response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Auth controller!",
      error: error.message,
    });
  }
};

// User registration controller
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      contactNumber,
      confirmPassword,
      otp,
    } = req.body;

    // Validations
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match!",
      });
    }

    // Check if the user exists
    const userExistOrNotCheckFromTheDb = await User.findOne({ email: email });
    if (userExistOrNotCheckFromTheDb) {
      return res.status(400).json({
        success: false,
        message: "Email already exists! Please login.",
      });
    }

    // Find the most recent OTP
    const recentOtp = await Otp.find({ email: email }).sort({ createdAt: -1 }).limit(1);
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP is not found!",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    const ProfileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // Store the user in the database
    const signupDataStoredToDb = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType,
      contactNumber,
      additionalDetails: ProfileDetails._id,
      images: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    return res.status(200).json({
      success: true,
      data: signupDataStoredToDb,
      message: "Signup successful!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Signup controller!",
      error: error.message,
    });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validations
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required!",
      });
    }

    // Check if the email exists
    const user = await User.findOne({ email: email }).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Compare passwords
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password!",
      });
    }

    // Generate JWT token
    const payload = {
      id: user._id,
      email: user.email,
      role: user.accountType,
    };
    const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
      expiresIn: "2h",
    });

    user.token = token;
    user.password = undefined;

    // Set cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("edtech-login-users", token, options).status(200).json({
      success: true,
      token,
      message: "Login successful!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Login controller!",
      error: error.message,
    });
  }
};

// Change password controller
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect old password!",
      });
    }

    // Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match!",
      });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email (assuming mailSender and passwordUpdated are defined)
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
