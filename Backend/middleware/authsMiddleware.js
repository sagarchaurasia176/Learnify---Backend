const jwt = require("jsonwebtoken");
require("dotenv").config();

// Main auth middleware
exports.authsCheck = async (req, res, next) => {
  try {
    const token =// Note: 'req.cookies' not 'req.Cookies'
      req.body.token    // Check if token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing at middleware!",
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.Secret_token);
      req.user = decoded; // Note: 'req.user' not 'req.User'
      console.log("token in auth middlware" , decoded);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
        error: err.message,
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
      error: err.message,
    });
  }
};

// isStudent middleware
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Protected route: only for students",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Student role cannot be verified",
      error: err.message,
    });
  }
};

// isInstructor middleware
exports.isInstructor = (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Protected route: only for instructors",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Instructor role cannot be verified",
      error: err.message,
    });
  }
};

// isAdmin middleware
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") { // Fixed role check
      return res.status(403).json({
        success: false,
        message: "Protected route: only for admins",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Admin role cannot be verified",
      error: err.message,
    });
  }
};
