const express = require("express");
const CourseRouter = express.Router();
// courses controller functions
const {
  createCourses,
  getAllCourses,
  CourseDetails,
} = require("../controller/Courses");
const {
  createCategory,
  categoryPageDetails,
} = require("../controller/Category");
const {
  createSection,
  deleteSections,
  updateSection,
} = require("../controller/Sections");
const {
  CreateSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controller/SubSection");
const {
  CreateRating,
  getAverageAllRating,
  getAverageRating,
} = require("../controller/rateAndReviews");
// Middlewwares apply here
const {
  authsCheck,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middleware/authsMiddleware");
// all the courses  routes
CourseRouter.post("/api/createCourse", authsCheck, isInstructor, createCourses);

// This are the basic details thats why not used the route
CourseRouter.get("/api/AllCourses", getAllCourses);
CourseRouter.post("/api/CourseDetails", CourseDetails);

// category controllers
CourseRouter.post("/api/category", authsCheck, isAdmin, createCategory);
CourseRouter.post("/api/categoryDetails", categoryPageDetails);

// pedning show all categeory

// create section controllers
CourseRouter.post(
  "/api/createSection",
  authsCheck,
  isInstructor,
  createSection
);
CourseRouter.post(
  "/api/deleteSection",
  authsCheck,
  isInstructor,
  updateSection
);
CourseRouter.post(
  "/api/updateSection",
  authsCheck,
  isInstructor,
  deleteSections
);

//create sub sections controller
CourseRouter.post(
  "/api/createSubSection",
  authsCheck,
  isInstructor,
  CreateSubSection
);
CourseRouter.post(
  "/api/upadteSubSection",
  authsCheck,
  isInstructor,
  updateSubSection
);
CourseRouter.post(
  "/api/deleteSubSection",
  authsCheck,
  isInstructor,
  deleteSubSection
);

// middelwares

CourseRouter.post("/api/rating", authsCheck, isStudent, CreateRating);
CourseRouter.get("/api/getRating", getAverageAllRating);
CourseRouter.get("/api/getAvergaeRating", getAverageRating);

// Coures Routers
module.exports = CourseRouter;
