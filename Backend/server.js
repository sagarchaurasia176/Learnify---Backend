const express = require("express");
// frontend  + backend conenction requrired cors
const cors = require("cors");
//file upload
const fileUpload = require("express-fileupload");
// cloudinary connected
const MediaUploaderToCloud = require("./utils/MediaUploderToCloud");
// for middleware purpose
const cookieParser = require("cookie-parser");
// app for mounting purpose
const app = express();
// dotenv file
require("dotenv").config();
// dbconnection
const dbConnectionFunctionCall = require("./config/Edtechdb");
// All routes
const CourseRouter = require("./routes/Course");
const PaymentRoutes = require("./routes/Payment");
const ProfileRoutes = require("./routes/Profile");
const UserRoutes = require("./routes/User");

app.use("/api/Courses", CourseRouter);
app.use("/api/Payment", PaymentRoutes);
app.use("/api/Profile", ProfileRoutes);
app.use("/api/User", UserRoutes);

// Port listen
const PORT = process.env.PORT || 8000;
// connectious mountings
app.use(express.json());
// dbconnection
dbConnectionFunctionCall();

// cookie parser
app.use(cookieParser());
// call directly to the frontend
app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);

// file upload middleware to the cloudinary
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// connection to cloudinary
MediaUploaderToCloud();

// defalut routes
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "server running well !",
  });
});

// main listen port
app.listen(PORT, () => {
  console.log(`server moving at this ${PORT}`);
});
