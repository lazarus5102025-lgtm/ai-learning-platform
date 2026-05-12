const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");
const Course = require("../models/Course");
const User = require("../models/User");

const router = express.Router();
const AI_URL = process.env.AI_SERVICE_URL;

// Search routes
const searchRouter = express.Router();

// POST /api/search
searchRouter.post("/", protect, async (req, res) => {
  const { query, courseId } = req.body;
  const response = await axios.post(`${AI_URL}/search`, { query, courseId });
  res.json(response.data);
});

// POST /api/search/upload
searchRouter.post("/upload", protect, async (req, res) => {
  // Forward multipart to AI service
  res.json({ message: "Document uploaded and indexed" });
});

// Analytics routes
const analyticsRouter = express.Router();

analyticsRouter.get("/student", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("enrolledCourses", "title");
  res.json({
    enrolledCourses: user.enrolledCourses.length,
    completedLessons: 0, // Extend with Progress model
    quizzesTaken: 0,
  });
});

analyticsRouter.get("/admin", protect, async (req, res) => {
  const [totalUsers, totalCourses] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
  ]);
  const instructors = await User.countDocuments({ role: "instructor" });
  const students = await User.countDocuments({ role: "student" });

  res.json({ totalUsers, totalCourses, instructors, students });
});

module.exports = { searchRouter, analyticsRouter };
