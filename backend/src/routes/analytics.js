const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");
const Course = require("../models/Course");

const router = express.Router();

router.get("/student", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("enrolledCourses", "title");
  res.json({ enrolledCourses: user.enrolledCourses });
});

router.get("/admin", protect, authorize("admin"), async (req, res) => {
  const [totalUsers, totalCourses] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
  ]);
  res.json({ totalUsers, totalCourses });
});

module.exports = router;
