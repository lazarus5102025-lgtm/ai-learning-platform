const express = require("express");
const Course = require("../models/Course");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/courses
router.get("/", protect, async (req, res) => {
  const { category, level, search, page = 1, limit = 10 } = req.query;
  const filter = { isPublished: true };

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) filter.$text = { $search: search };

  const courses = await Course.find(filter)
    .populate("instructor", "name avatar")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Course.countDocuments(filter);
  res.json({ courses, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/courses/:id
router.get("/:id", protect, async (req, res) => {
  const course = await Course.findById(req.params.id).populate("instructor", "name avatar email");
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

// POST /api/courses
router.post("/", protect, authorize("instructor", "admin"), async (req, res) => {
  const course = await Course.create({ ...req.body, instructor: req.user._id });
  res.status(201).json(course);
});

// PUT /api/courses/:id
router.put("/:id", protect, authorize("instructor", "admin"), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to edit this course" });
  }

  Object.assign(course, req.body);
  await course.save();
  res.json(course);
});

// DELETE /api/courses/:id
router.delete("/:id", protect, authorize("instructor", "admin"), async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json({ message: "Course deleted" });
});

// POST /api/courses/:id/enroll
router.post("/:id/enroll", protect, authorize("student"), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (course.enrolledStudents.includes(req.user._id)) {
    return res.status(400).json({ message: "Already enrolled" });
  }

  course.enrolledStudents.push(req.user._id);
  await course.save();
  res.json({ message: "Enrolled successfully" });
});

module.exports = router;
