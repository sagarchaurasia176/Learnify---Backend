const mongoose = require("mongoose");
const MailSender = require("../utils/MailSender");

// OTP Schema
const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60, // 5 minutes expiration
  },
});

// Function to send the OTP via email
async function otpMailTransferDirectlyToTheServer(email, otp) {
  try {
    const mailResponse = await MailSender(
      email,
      "Verification Email from EdTech",
      `Your OTP is: ${otp}`
    );
    console.log("Mail Response:", mailResponse);
  } catch (err) {
    console.error("Error at OTP Mail Transfer:", err);
    throw err; // Throw the error to stop the OTP from being saved
  }
}

// Mongoose Pre-save Middleware
OtpSchema.pre("save", async function (next) {
  try {
    await otpMailTransferDirectlyToTheServer(this.email, this.otp);
    next(); // Proceed to save the OTP in the database
  } catch (err) {
    console.log("error at otp side", err);
  }
});

module.exports = mongoose.model("Otp", OtpSchema);
