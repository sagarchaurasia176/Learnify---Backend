
const express = require("express");
const {
  paymentGateway,
  paymentGatewayVerification,
} = require("../controller/PaymentGatway");
const { authsCheck, isStudent } = require("../middleware/authsMiddleware");
// Routers
const Paymentrouter = express.Router();

//middlewware check
Paymentrouter.post("/capturePayment", authsCheck, isStudent);
Paymentrouter.post("/verify", paymentGatewayVerification);

module.exports = Paymentrouter;
