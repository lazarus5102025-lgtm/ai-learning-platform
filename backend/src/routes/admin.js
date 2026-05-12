// backend/src/routes/admin.js
const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).skip((page - 1) * limit).limit(Number(limit));
  const total = await User.countDocuments(filter);
  res.json({ users, total });
});

router.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

router.get("/stats", async (req, res) => {
  const [users, courses] = await Promise.all([
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Course.countDocuments(),
  ]);
  res.json({ users, courses });
});

module.exports = router;
